import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// import Routers
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import listingRouter from "./routes/listing.route.js";

dotenv.config();

// connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
// CORS configuration to accept credentials
app.use(
  cors({
    origin: "*",
    credentials: true, // 允许携带凭证
    origin: (origin, callback) => {
      if (!origin) {
        // 允许非浏览器的请求（比如 Postman）
        callback(null, true);
      } else {
        // 这里可以加入逻辑来检查origin是否在你的允许列表中
        // 如果是，你可以回调 callback(null, true) 来允许这个来源的跨域请求
        // 为了简化，这里我们允许所有来源
        callback(null, true);
      }
    },
  })
);

app.use(express.json());

app.use(cookieParser());

app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
