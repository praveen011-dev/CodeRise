import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app=express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());



//routers imports

import healthCheckRouter from "./routes/healthcheck.routes.js"
import authRoutes from "./routes/auth.routes.js"

app.use("/api/v1/healthcheck",healthCheckRouter);
app.use("/api/v1/users",authRoutes);



// Global express error handler

app.use((err, _req, res, _next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      statusCode,
      message: err.message || "Internal Server Error",
      errors: err.errors || [],
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  });

  

export default app
