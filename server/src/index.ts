import express from "express";
import cors from "cors";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import dotenv from "dotenv";
import { auth } from "./lib/auth";
import { NotFoundError } from "./types/error";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config({quiet: true});

const app = express();
const port = process.env.PORT || 3000;

// Configure CORS first, before all routes
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  }),
);

app.use(express.json());
app.all("/api/auth/{*any}", toNodeHandler(auth));

app.get("/api/me", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return res.json(session);
});


// 404 处理：所有未匹配路由
app.use((req, res, next) => {
  next(new NotFoundError(`Can't find ${req.originalUrl}`));
});
// ⚠️ 全局错误处理中间件（必须放在最后！）
app.use(errorHandler);


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});