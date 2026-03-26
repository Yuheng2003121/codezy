import { createAuthClient } from "better-auth/client";
import { deviceAuthorizationClient } from "better-auth/client/plugins";
import { logger } from "better-auth";
import yoctoSpinner from "yocto-spinner";
import chalk from "chalk";

import { TokenData } from "./token";

/**
 * 设备授权响应数据
 */
export interface DeviceAuthResponse {
  device_code: string;
  user_code: string;
  verification_uri: string | undefined;
  verification_uri_complete: string | undefined;
  expires_in: number;
  interval: number;
}

/**
 * 设备授权客户端实例
 */
let authClient: ReturnType<typeof createAuthClient> | null = null;

/**
 * 获取或创建认证客户端
 */
function getAuthClient(serverUrl: string) {
  if (!authClient || authClient.options.baseURL !== serverUrl) {
    authClient = createAuthClient({
      baseURL: serverUrl,
      plugins: [deviceAuthorizationClient()],
    });
  }
  return authClient;
}

/**
 * 请求设备授权码
 */
export async function requestDeviceCode(
  serverUrl: string,
  clientId: string,
  scope = "openid profile email",
): Promise<DeviceAuthResponse> {
  const spinner = yoctoSpinner({
    text: "Requesting device authorization...",
    color: "cyan",
  });
  spinner.start();

  const client = getAuthClient(serverUrl);

  const { data, error } = await client.device.code({
    client_id: clientId,
    scope,
  });

  spinner.stop();

  if (error || !data) {
    logger.error(
      `Failed to request device authorization: ${error?.error_description || "Unknown error"}`,
    );
    throw new Error(
      `Device authorization failed: ${error?.error_description || "Unknown error"}`,
    );
  }

  return {
    device_code: data.device_code,
    user_code: data.user_code,
    verification_uri: data.verification_uri,
    verification_uri_complete: data.verification_uri_complete,
    expires_in: data.expires_in,
    interval: data.interval || 5,
  };
}

/**
 * 轮询获取 Token
 * @param serverUrl 服务器地址
 * @param deviceCode 设备授权码
 * @param interval 轮询间隔（秒）
 * @param maxWaitTime 最大等待时间（秒）
 * @returns Token 数据
 */
export async function pollForToken(
  serverUrl: string,
  deviceCode: string,
  interval: number = 5,
  maxWaitTime: number = 1800, // 30 分钟
): Promise<TokenData> {
  const client = getAuthClient(serverUrl);
  const startTime = Date.now();

  console.log(
    chalk.gray(`Waiting for authorization (max wait time: ${Math.floor(maxWaitTime / 60)} minutes)`),
  );

  while (Date.now() - startTime < maxWaitTime * 1000) {
    await new Promise((resolve) => setTimeout(resolve, interval * 1000));

    try {
      const { data, error } = await client.device.callback({
        device_code: deviceCode,
      });

      if (error) {
        if (error.error === "authorization_pending") {
          // 用户尚未授权，继续轮询
          continue;
        } else if (error.error === "access_denied") {
          throw new Error("Authorization denied by user");
        } else if (error.error === "expired_token") {
          throw new Error("Device code expired");
        } else {
          throw new Error(`Token retrieval failed: ${error.error_description || error.error}`);
        }
      }

      if (data) {
        return {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          expiresAt: Date.now() + (data.expires_in || 3600) * 1000,
          scope: data.scope,
        };
      }
    } catch (err) {
      // 网络错误或其他临时错误，继续轮询
      if (err instanceof Error && !err.message.includes("authorization_pending")) {
        throw err;
      }
    }
  }

  throw new Error("Authorization timeout exceeded");
}

/**
 * 获取验证 URI 的显示文本
 */
export function getVerificationDisplayText(
  verificationUri: string | undefined,
  verificationUriComplete: string | undefined,
  userCode: string,
): { url: string; code: string } {
  const url = verificationUriComplete || verificationUri || "";
  return { url, code: userCode };
}
