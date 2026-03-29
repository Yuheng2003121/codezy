import chalk from "chalk";
import { getStoredToken } from "../auth/token";
import yoctoSpinner from "yocto-spinner";
import prisma from "@/lib/prisma";
import { select } from "@clack/prompts";
import { Command } from "commander";

const choices = {
  message: "Select an Option:",
  options: [
    {
      value: "chat",
      label: "Chat",
      hint: "Simple chat with AI",
    },
    {
      value: "tool",
      label: "Tool Calling",
      hint: "Chat with tools (Google Search, Code Execution)",
    },
    {
      value: "agent",
      label: "Agentic Mode",
      hint: "Advanced AI agent (Coming soon)",
    },
  ],
};


const wakeUpAction = async () => {
  const token = await getStoredToken();

  if (!token?.access_token) {
    console.log(chalk.red("Please login first."));
    return;
  }

  const spinner = yoctoSpinner({text: "Fetching user information"});
  spinner.start();

  const user = await prisma.user.findFirst({
    where: {
      sessions: {
        some: {
          token: token.access_token
        }
      }
    },
  })

  if (!user) {
    spinner.error("User not found!"); 
    return;
  }

  spinner.stop();

  console.log(chalk.green(`Welcome back, ${user.name}!`));

  const choice = await select(choices);

  switch (choice) {
    case "chat":
      console.log(chalk.green("Chat mode"));
      break; 
    case "tool":
      console.log(chalk.green("Tool calling mode"));
      break;
    case "agent":
      console.log(chalk.green("Agentic mode"));
      break;
  }
}

export const wakeUp = new Command("wakeup")
.description("Wake up the AI assistant")
.action(wakeUpAction);