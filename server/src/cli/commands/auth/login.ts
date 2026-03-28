import { cancel, confirm, intro, isCancel, outro } from "@clack/prompts";
import { createAuthClient } from "better-auth/client";
import { deviceAuthorizationClient } from "better-auth/client/plugins";
import path from "path";
import os from "os";
import open from "open";
import dotenv from "dotenv";
import z from "zod";
import chalk from "chalk";
import { Command } from "commander";
import yoctoSpinner from "yocto-spinner";
import { logger } from "better-auth";

// 加载环境变量
dotenv.config();

const URL = process.env.BASE_URL;
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;

/**
 * 统一处理 Clack 的取消逻辑 (Esc/Ctrl+C)
 */
function handlePromptCancel(value: string) {
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

  if (!serverUrl || !clientId) {
    console.error(
      chalk.red("Error: Missing serverUrl or clientId, check .env or options"),
    );
    process.exit(1);
  }

  return { serverUrl, clientId };
}

/**
 * 2. 检查现有登录状态
 */
async function checkExistingAuth() {
  // TODO: 后续对接真实的 Token 校验逻辑
  const existingToken = false;
  const expired = false;

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
  const spinner = yoctoSpinner({
    text: "Requesting device authorization...",
    color: "cyan",
  });

  spinner.start();
  const { data, error } = await authClient.device.code({
    client_id: clientId,
    scope: "openid profile email",
  });
  spinner.stop();

  if (error || !data) {
    logger.error(
      `Failed to request device authorization: ${error?.error_description || "Unknown error"}`,
    );
    process.exit(1);
  }

  return data;
}

/**
 * 4. 展示授权信息并处理浏览器打开
 */
async function handleUserConfirmation(data: any) {
  const { user_code, verification_uri, verification_uri_complete, expires_in } =
    data;

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
    const urlToOpen = verification_uri || verification_uri_complete;
    await open(urlToOpen);
  }

  console.log(
    chalk.gray(
      `Waiting for authorization (expires in ${Math.floor(expires_in / 60)} minutes)`,
    ),
  );
}

/**
 * 5. 错误处理
 */
function handleError(error: any) {
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

    // 4. 初始化客户端并请求 Code
    const authClient = createAuthClient({
      baseURL: serverUrl,
      plugins: [deviceAuthorizationClient()],
    });

    const authData = await requestDeviceAuthorization(authClient, clientId);

    // 5. 展示信息并引导用户
    await handleUserConfirmation(authData);

    // TODO: 准备进入轮询获取 Token 的阶段...
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
