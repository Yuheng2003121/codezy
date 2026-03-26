import fs from "fs/promises";
import path from "path";
import os from "os";

/**
 * Token 数据结构
 */
export interface TokenData {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number; // Unix 时间戳
  scope?: string;
}

/**
 * Token 元数据（用于检查状态）
 */
export interface TokenStatus {
  exists: boolean;
  expired: boolean;
  token?: TokenData;
}

// 配置目录和文件路径
export const CONFIG_DIR = path.join(os.homedir(), ".better-auth");
export const TOKEN_FILE = path.join(CONFIG_DIR, "token.json");

/**
 * 确保配置目录存在
 */
async function ensureConfigDir(): Promise<void> {
  try {
    await fs.access(CONFIG_DIR);
  } catch {
    await fs.mkdir(CONFIG_DIR, { recursive: true });
  }
}

/**
 * 保存 Token 到本地文件
 */
export async function saveToken(token: TokenData): Promise<void> {
  await ensureConfigDir();
  await fs.writeFile(TOKEN_FILE, JSON.stringify(token, null, 2), "utf-8");
}

/**
 * 从本地文件读取 Token
 */
export async function getToken(): Promise<TokenData | null> {
  try {
    await fs.access(TOKEN_FILE);
    const content = await fs.readFile(TOKEN_FILE, "utf-8");
    return JSON.parse(content) as TokenData;
  } catch {
    return null;
  }
}

/**
 * 删除本地 Token
 */
export async function deleteToken(): Promise<void> {
  try {
    await fs.unlink(TOKEN_FILE);
  } catch {
    // 文件不存在时忽略错误
  }
}

/**
 * 检查 Token 状态
 */
export async function checkTokenStatus(): Promise<TokenStatus> {
  const token = await getToken();

  if (!token) {
    return { exists: false, expired: true };
  }

  const isExpired = Date.now() >= token.expiresAt;

  return {
    exists: true,
    expired: isExpired,
    token,
  };
}

/**
 * 检查 Token 是否有效（存在且未过期）
 */
export async function isValidToken(): Promise<boolean> {
  const status = await checkTokenStatus();
  return status.exists && !status.expired;
}
