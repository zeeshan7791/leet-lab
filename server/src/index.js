import express from "express"
import dotenv from "dotenv"
import { PrismaClient } from '@prisma/client';
dotenv.config()
const app=express()
const prisma = new PrismaClient();

app.use(express.json());
app.post('/register', async (req, res) => {
    console.log(req.body,'body-----------------')
    const { email, username, password } = req.body;
    try {
      const user = await prisma.user.create({
        data: {
          email,
          username,
          password,
        },
      });
      console.log(user,"user----------")
      res.status(201).json(user,"user register");
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  });
  
  app.get('/', (req, res) => {
    res.send('Hello,Guys Welcome to leetlab 🧑‍💻');
  });

  const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})