#!/usr/bin/env node
/**
 *  需要把当前文件变为可执行文件 chmod +x src/cli/main.ts
 *
 * chalk: 用于给终端文字上色（比如把标题变成青色）。
 * dotenv: 用于读取项目根目录的 .env 文件，加载环境变量（如 API Key, 数据库密码）。
 * figlet: 一个生成 ASCII 艺术字的库。就是把普通文字变成大大的字符画。
 * Command: 从 commander 库导入核心类，用于构建命令行指令（如定义 login, chat 等子命令）。注：这段代码里导入了但还没使用。
 */
import chalk from "chalk";
import dotenv from "dotenv";
import figlet from "figlet";

import { Command } from "commander";
import { login } from "./commands/auth/login.ts";
import { logout } from "./commands/auth/logout.ts";
import { userInfo } from "./commands/auth/userInfo.ts";

dotenv.config({ quiet: true });

async function main() {
  console.log(
    chalk.cyan(
      figlet.textSync("coder-cli", {
        font: "Standard",
        horizontalLayout: "default",
      }),
    ),
  );
  console.log(chalk.gray("A cli based AI Tool \n"));

  const program = new Command("coder-cli");

  // 配置版本号和描述
  program
    .version("0.0.1")
    .description("coder-cli - A CLI Based AI Tool")
    .addCommand(login)
    .addCommand(logout)
    .addCommand(userInfo)

  // 如果用户只输入 coder-cli 而不带子命令，显示帮助信息
  program.action(() => {
    program.help();
  });

  // 解析用户输入的命令行参数
  program.parse(process.argv);
}

main().catch((err) => {
  console.error(chalk.red("Error:"), err);
  process.exit(1);
});
