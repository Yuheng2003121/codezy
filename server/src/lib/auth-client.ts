import { createAuthClient } from "better-auth/client";
import { deviceAuthorizationClient } from "better-auth/client/plugins";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// 获取当前脚本所在的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 强制指向 server 目录下的 .env 文件，并开启安静模式
dotenv.config({ 
  path: path.resolve(__dirname, "../../.env"),
  quiet: true 
});

const authClient = createAuthClient({
  baseURL: process.env.BASE_URL || "http://localhost:3005",
  plugins: [deviceAuthorizationClient()],
});

export default authClient;
