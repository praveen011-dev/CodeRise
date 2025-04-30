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
import problemRoutes from "./routes/problem.routes.js"

app.use("/api/v1/healthcheck",healthCheckRouter);
app.use("/api/v1/users",authRoutes);
app.use("/api/v1/problems",problemRoutes);



// Global express error handler

app.use((err, _req, res, _next) => {
    const statusCode = err.statusCode || 500;
    let message=err.message || "Internal Server Error"

    if (message.includes("Can't reach database server"))
      {
      message = "Please make sure your database server is running at localhost:5432.";
      }

    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      errors: err.errors || [],
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  });

  

export default app
