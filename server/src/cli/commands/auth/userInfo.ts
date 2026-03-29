import chalk from "chalk";
import { requireAuth } from "../utils/token.ts";
import prisma from "../../../lib/prisma.ts";
import { Command } from "commander";

export async function userInfoAction() {
  const token = await requireAuth();
  if (!token?.access_token) {
    console.error(chalk.red("❌ Not authenticated. Please run 'your-cli login' first."));
    process.exit(1);
  }

  const user = await prisma.user.findFirst({
    where: {
      sessions: {
        some: {
          token: token.access_token,
        }
      }
    }
  })

  if (!user) {
    console.error(chalk.red("❌ Not authenticated. Please run 'your-cli login' first."));
    process.exit(1);
  }

  console.log(chalk.greenBright(`✅ Logged in as User: ${user.name} Email:${user.email}`));
}

export const userInfo = new Command("whoami")
  .description("Show current user info")
  .action(userInfoAction);