
import dotenv from "dotenv"
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is loaded correctly regardless of where the script is run from
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });


export const openaiConfig = {
  baseURL: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
}



