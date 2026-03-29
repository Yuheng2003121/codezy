import { confirm, intro, isCancel, outro } from "@clack/prompts";
import chalk from "chalk";
import { clearStoredToken, getStoredToken } from "../utils/token.ts";
import { CLIENT_ID, handlePromptCancel, URL } from "./login.ts";
import { Command } from "commander";

export async function logoutAction() {
  intro(chalk.bold("Logging out..."));

  const token = await getStoredToken();

  if (!token) {
    console.log(
      chalk.red("❌ Not authenticated. Please run 'your-cli login' first."),
    );
    process.exit(1);
  }

  const shouldLogout = await confirm({
    message: "Are you sure you want to logout?",
    initialValue: false,
  });

  if (isCancel(shouldLogout) || !shouldLogout) {
    handlePromptCancel("Logout cancelled");
  }

  const cleared = await clearStoredToken();

  if (cleared) {
    outro(chalk.green("Logged out successfully!"));
  } else {
    console.error(chalk.yellow("Failed to logout"));
    process.exit(1);
  }
}

// --------- COMMANDER 配置 -----------

export const logout = new Command("logout")
  .description("Logout to the Better Auth server")
  .action(logoutAction);
