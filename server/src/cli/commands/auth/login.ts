import { cancel, confirm, intro, isCancel, outro } from "@clack/prompts";
import path from "path";
import os from "os";
import open from "open";
import dotenv from "dotenv";
import z from "zod";
import chalk from "chalk";
import { Command } from "commander";
import yoctoSpinner from "yocto-spinner";
import { logger } from "better-auth";
import { getStoredToken, isTokenExpired, storeToken } from "../utils/token.ts";
import authClient from "../../../lib/auth-client.ts";
import { fileURLToPath } from "url";

// 获取当前脚本所在的目录并加载环境变量
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// 路径：src/cli/commands/auth/login.ts -> auth -> commands -> cli -> src -> server 根目录
const envPath = path.resolve(__dirname, "../../../../.env");
dotenv.config({ path: envPath, quiet: true });

export const URL = process.env.BASE_URL || "http://localhost:3005";
export const CLIENT_ID = process.env.GITHUB_CLIENT_ID;

export const CONFIG_DIR = path.join(os.homedir(), ".coder-cli-auth");
export const TOKEN_FILE = path.join(CONFIG_DIR, "token.json");

const mainSpinner = yoctoSpinner({ text: "", color: "cyan" });

/**
 * 统一处理 Clack 的取消逻辑 (Esc/Ctrl+C)
 */
export function handlePromptCancel(value: string) {
  cancel(value);
  process.exit(0);
}

/**
 * 1. 配置与参数校验
 */
function validateAndGetConfig(opts: any) {
  const optionsSchema = z.object({
    serverUrl: z.string().optional(),
    clientId: z.string().optional(),
  });

  const parsedOptions = optionsSchema.parse(opts);
  const serverUrl = parsedOptions.serverUrl || URL;
  const clientId = parsedOptions.clientId || CLIENT_ID;

  if (!serverUrl) {
    console.error(
      chalk.red(
        "Error: Missing serverUrl. Please provide it via --server-url or BASE_URL env variable.",
      ),
    );
    process.exit(1);
  }

  if (!clientId) {
    console.error(
      chalk.red(
        "Error: Missing clientId. Please provide it via --client-id or GITHUB_CLIENT_ID env variable.",
      ),
    );
    process.exit(1);
  }

  return { serverUrl, clientId };
}

/**
 * 2. 检查现有登录状态
 */
async function checkExistingAuth() {
  const existingToken = await getStoredToken();
  const expired = await isTokenExpired();

  if (existingToken && !expired) {
    const shouldReAuth = await confirm({
      message: "You are already logged in. Do you want to login again?",
      initialValue: false,
    });

    if (isCancel(shouldReAuth) || !shouldReAuth) {
      handlePromptCancel("Login cancelled");
    }
  }
}

/**
 * 3. 发起设备流授权请求
 */
async function requestDeviceAuthorization(authClient: any, clientId: string) {
  mainSpinner.text = "Requesting device authorization...";
  mainSpinner.start();

  try {
    const { data, error } = await authClient.device.code({
      client_id: clientId,
      scope: "openid profile email",
    });

    if (error || !data) {
      mainSpinner.stop();
      logger.error(
        `Failed to request device authorization: ${error?.error_description || "Unknown error"}`,
      );
      process.exit(1);
    }

    return data;
  } catch (err) {
    mainSpinner.stop();
    if (err instanceof Error && err.message.includes("fetch failed")) {
      console.error(
        chalk.red(
          `\n❌ Could not connect to the server. Is it running at ${URL}?`,
        ),
      );
      process.exit(1);
    }
    throw err;
  } finally {
    mainSpinner.stop();
  }
}

/**
 * 4. 展示授权信息并处理浏览器打开
 */
async function handleUserConfirmation(
  data: any,
  authClient: any,
  clientId: string,
) {
  const {
    user_code,
    verification_uri,
    verification_uri_complete,
    expires_in,
    device_code,
  } = data;

  console.log(chalk.cyan(`\nDevice Authorization Required`));
  console.log(
    `Please visit: ${chalk.underline.blue(verification_uri || verification_uri_complete)}`,
  );
  console.log(`Enter code: ${chalk.bold.green(user_code)}`);

  const shouldOpen = await confirm({
    message: "Open browser automatically",
    initialValue: true,
  });

  if (isCancel(shouldOpen)) {
    handlePromptCancel("Open browser automatically cancelled");
  }

  if (shouldOpen) {
    const urlToOpen = verification_uri_complete || verification_uri;
    await open(urlToOpen);
  }

  console.log(
    chalk.gray(
      `Waiting for authorization (expires in ${Math.floor(expires_in / 60)} minutes)`,
    ),
  );

  try {
    // 发起轮询，直到拿到access_token
    const token: any = await pollForToken(authClient, device_code, clientId);
    if (token) {
      const saved = await storeToken(token);

      if (!saved) {
        console.log(
          chalk.yellow(
            "⚠️  Token is valid but could not be stored. Please copy it manually:",
          ),
        );
        console.log(chalk.bold.yellow(token.access_token));
      }

      // TODO：get the user data
      outro(chalk.green("Login successfully!"));
      console.log(chalk.gray(`\n Token saved to: ${TOKEN_FILE}`));
    }
  } catch (error) {
    mainSpinner.stop();

    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(chalk.red("\nLogin failed:"), errorMessage);
    process.exit(1);
  }
}

async function pollForToken(
  authClient: any,
  deviceCode: string,
  clientId: string,
  initialInterval = 5,
) {
  let pollingInterval = initialInterval;
  let dots = 0;

  return new Promise((resolve, reject) => {
    const poll = async () => {
      dots = (dots + 1) % 4;
      mainSpinner.text = chalk.gray(
        `Waiting for authorization ${".".repeat(dots)}${" ".repeat(3 - dots)}`,
      );
      if (!mainSpinner.isSpinning) mainSpinner.start();

      try {
        // 设备需要不断地询问服务器：“用户按确认键了吗？
        const { data, error } = await authClient.device.token({
          grant_type: "urn:ietf:params:oauth:grant-type:device_code",
          device_code: deviceCode,
          client_id: clientId,
          fetchOptions: {
            headers: {
              "user-agent": `My CLI`,
            },
          },
        });

        if (data?.access_token) {
          mainSpinner.stop();
          resolve(data);
          return;
        } else if (error) {
          switch (error.error) {
            case "authorization_pending":
              // Continue polling
              break;
            case "slow_down":
              pollingInterval += 5;
              break;
            case "access_denied":
              mainSpinner.stop();
              console.log(chalk.red("\nAccess was denied by the user"));
              process.exit(1);
            case "expired_token":
              mainSpinner.stop();
              console.log(
                chalk.red("\nThe device code has expired. Please try again."),
              );
              process.exit(1);
            default:
              mainSpinner.stop();
              throw new Error(error.error_description || "Unknown error");
          }
          setTimeout(poll, pollingInterval * 1000);
        }
      } catch (error) {
        mainSpinner.stop();
        logger.error(`Error: ${error}`);
        process.exit(1);
      }
    };
    poll();
  });
}

/**
 * 5. 错误处理
 */
function handleError(error: any) {
  mainSpinner.stop();
  let errorMessage;
  if (error instanceof z.ZodError) {
    errorMessage = error.message;
  } else {
    errorMessage = error?.message || error || "An unexpected error occurred";
  }
  console.error(chalk.red("\nError: ", errorMessage));
  process.exit(1);
}

/**
 * 登录命令的核心骨架
 */
export async function loginAction(opts: any) {
  try {
    // 1. 获取配置
    const { serverUrl, clientId } = validateAndGetConfig(opts);

    // 2. UI 开场
    intro(chalk.bold("Better Auth Login"));

    // 3. 检查会话
    await checkExistingAuth();

    // 初始化客户端并请求 Code， 这个authData包含user_code和device_code
    const authData = await requestDeviceAuthorization(authClient, clientId);

    // 5. 展示信息并引导用户
    await handleUserConfirmation(authData, authClient, clientId);
  } catch (error) {
    handleError(error);
  }
}

// --------- COMMANDER 配置 -----------

export const login = new Command("login")
  .description("Login to the Better Auth server")
  .option("--server-url <url>", "Specify the server URL", URL)
  .option("--client-id <id>", "Specify the client ID", CLIENT_ID)
  .action(loginAction);
