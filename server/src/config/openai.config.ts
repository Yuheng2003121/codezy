import dotenv from "dotenv"
import { findUpSync } from "find-up";

// Use find-up to robustly locate the .env file in the project root
dotenv.config({ path: findUpSync(".env") });


export const openaiConfig = {
  baseURL: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
}



