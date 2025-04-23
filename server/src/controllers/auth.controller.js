import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../libs/db.js";

import { UserRole } from "../generated/prisma/index.js";
const register = async (req, res) => {
  console.log(req.body, "body-----------------");
  const { email, name, password } = req.body;
  try {
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });
    // console.log(existingUser,'existing user---------')

    if (existingUser) {
      return res.status(400).json({ error: "User already exist" });
    }
    console.log(existingUser, "existing user---------");
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log("hashed----------------")
    const newUser = await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: UserRole.USER,
      },
    });
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    console.log(token);
    res.cookie("leet", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.status(201).json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        image: newUser.image,
      },
      message: "User register successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
};

const login = async (req, res) => {
  console.log(req.body, "login body");
  const { email, password } = req.body;
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    console.log(user);
    if (!user) {
      res.status(401).json("user not found ");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (!isMatch) {
      return res.status(400).json({ error: "invalid credentials" });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    console.log(token);
    res.cookie("leet", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image,
      },
      message: "User login successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Error logging user" });
  }
};
const logout = async (req, res) => {
  try {
    res.clearCookie("leet", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });

    return res
      .status(204)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error while logging out" });
  }
};

const check = async (req, res) => {
  try {
    res
      .status(200)
      .json({
        user: req.user,
        message: "user auth successfully",
        success: true,
      });
  } catch (error) {
    res.status(500).json({ error: "error while authenticating" });
  }
};

export { register, login, logout, check };
