import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import dotenv from "dotenv";
import { deviceAuthorization } from "better-auth/plugins"; 

// Load environment variables
dotenv.config();

// If your Prisma file is located elsewhere, you can change the path


export const auth = betterAuth({
  baseURL: process.env.BASE_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  basePath: "/api/auth",
  trustedOrigins: [process.env.FRONTEND_URL!],
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  plugins: [
    // 处理设备授权请求
    deviceAuthorization({
      verificationUri: "/device",
      expiresIn: "30m",
      interval: "5s",
    }),
  ],
});
