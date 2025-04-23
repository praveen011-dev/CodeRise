import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app=express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());



//routers imports

import healthCheckRouter from "./routes/healthcheck.routes.js"

app.use("/api/v1/healthcheck",healthCheckRouter);

export default app
