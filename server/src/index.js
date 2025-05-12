import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { PrismaClient } from '@prisma/client';
import authRoutes from "./routes/auth.routes.js";
import problemRoutes from "./routes/problem.routes.js";
import executeRoutes from "./routes/executeCode.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
dotenv.config()
const app=express()
const prisma = new PrismaClient();

app.use(express.json());
app.use(cookieParser())
  
  app.get('/', (req, res) => {
    res.send('Hello,Guys Welcome to leetlab 🧑‍💻');
  });

  const PORT = process.env.PORT || 5000;
  app.use("/api/v1/auth",authRoutes)
  app.use("/api/v1/problems",problemRoutes)
  app.use("/api/v1/execute-code",executeRoutes)
  app.use("/api/v1/submission",submissionRoutes)
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})