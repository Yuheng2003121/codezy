import { cancel, confirm, intro, isCancel, outro } from "@clack/prompts";
import { createAuthClient } from "better-auth/client";
import { deviceAuthorizationClient } from "better-auth/client/plugins";
import path from "path";
import os from "os";

import dotenv from "dotenv";
import z from "zod/v4";
import chalk from "chalk";
import { Command } from "commander";
import yoctoSpinner from "yocto-spinner";
import { logger } from "better-auth";

// 加载环境变量（如 BASE_URL, GITHUB_CLIENT_ID 等）
dotenv.config();

// 从环境变量中获取基础配置，如果没有则为 undefined
const URL = process.env.BASE_URL;
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;

// 定义本地 Token 存储的目录（用户主目录下的 .better-auth 文件夹）
const CONFIG_DIR = path.join(os.homedir(), ".better-auth");
// 定义具体的 Token 文件路径
const TOKEN_FILE = path.join(CONFIG_DIR, "token.json");

/**
 * 统一处理 Clack 的取消逻辑 (Esc/Ctrl+C)
 * 如果用户强行中断，打印信息并安全退出
 */
function handlePromptCancel(value: string) {
  cancel(value);
  process.exit(0);
}

/**
 * 登录命令的核心执行逻辑
 * @param opts 命令行传入的参数对象
 */
export async function loginAction(opts) {
  // 定义参数的校验规则：serverUrl 和 clientId 都是可选的字符串
  const options = z.object({
    serverUrl: z.string().optional(),
    clientId: z.string().optional(),
  });

  try {
    // 验证传入的参数是否符合规则
    const parsedOptions = options.parse(opts);

    // 确定最终使用的服务器地址和客户端 ID（命令行参数优先，环境变量次之）
    const serverUrl = parsedOptions.serverUrl || URL;
    const clientId = parsedOptions.clientId || CLIENT_ID;

    // 如果两个关键配置都缺失，则打印错误并强制退出
    if (!serverUrl || !clientId) {
      console.error(
        chalk.red(
          "Error: Missing serverUrl or clientId, please check .env or command options",
        ),
      );
      process.exit(1); // 告诉系统程序遇到了错误，无法继续执行
    }

    // 在终端展示美观的命令标题
    intro(chalk.bold("Better Auth Login"));

    // --- 状态检查阶段 (待完善) ---
    // TODO: 对接真实的 Token 管理工具
    const existingToken = false; // 模拟：当前是否存在有效的 Token
    const expired = false; // 模拟：Token 是否已过期

    // 如果已经登录且没有过期，提示用户是否要强制重新登录
    if (existingToken && !expired) {
      const shouldReAuth = await confirm({
        message: "You are already logged in. Do you want to login again?",
        initialValue: false,
      });

      // 如果是 Esc 取消，或者用户选了 "No"，则直接退出
      if (isCancel(shouldReAuth) || !shouldReAuth) {
        handlePromptCancel("Login cancelled");
      }
    }

    // Device Flow 授权流程代码
    // 使用 better-auth/client 发起设备授权请求，轮询获取 Token
    const authClient = createAuthClient({
      baseURL: serverUrl,
      plugins: [deviceAuthorizationClient()],
    });

    const spinner = yoctoSpinner({
      text: "Requesting device authorization...",
      color: "cyan",
    });
    spinner.start();

    const { data, error } = await authClient.device.code({
      client_id: clientId,
      scope: "openid profile email",
    });

    if (error || !data) {
      logger.error(
        `Failed to request device authorization: ${error.error_description}`,
      );
      process.exit(1);
    }

    spinner.stop();

    const {
      device_code,
      user_code,
      verification_uri,
      verification_uri_complete,
      expires_in,
      interval,
    } = data;

    console.log(chalk.cyan(`Device Authorization Required`));
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

    // 如果用户没有esc 并且 明确选择了 Yes，则打开浏览器
    if (!isCancel(shouldOpen) && shouldOpen) {
      const urlToOpen = verification_uri || verification_uri_complete;
      await open(urlToOpen);
    }

    console.log(
      chalk.gray(
        `Waiting for authorization (expires in ${Math.floor(expires_in / 60)} minutes)`,
      ),
    );
  } catch (error) {
    let errorMessage;
    // 捕获并处理参数校验失败的错误
    if (error instanceof z.ZodError) {
      errorMessage = error.message;
    } else {
      errorMessage = error || "An unexpected error occurred";
    }
    console.error(chalk.red(errorMessage));
    process.exit(1);
  }
}

// --------- COMMANDER 命令配置 -----------

// 创建一个名为 "login" 的子命令
export const login = new Command("login")
  .description("Login to the Better Auth server") // 命令的英文描述
  .option("--server-url <url>", "Specify the server URL", URL) // 定义 --server-url 选项，默认值为环境变量里的 URL
  .option("--client-id <id>", "Specify the client ID", CLIENT_ID) // 定义 --client-id 选项，默认值为环境变量里的 CLIENT_ID
  .action(loginAction); // 绑定上面定义好的处理函数
