import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../libs/db.js";
import crypto from "crypto";

import { UserRole } from "../generated/prisma/index.js";
import { asyncHandler } from "../utils/async.handler.js";
import { ApiResponse } from "../utils/api.response.js";
import { forgotPasswordMailGenContent, sendMail } from "../utils/mail.js";
const register = async (req, res) => {
  console.log(req.body, "body-----------------");
  const { email, name, password } = req.body;

  try {
    console.log("before db")
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });
    console.log(existingUser,'existing user---------')
console.log("after db")
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
    console.log("before----")
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    console.log("after-------")
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
        token:user.forgotPasswordToken,
      },
      message: "User login successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Error logging user" });
  }
};


const forgotPassword = asyncHandler(async (req, res) => {

  const { email } = req.body;
  const user = await db.user.findUnique({
      where: {
        email,
      },
    });
   
  console.log(user,'user in forgot')
  if (!user) {
    return res.status(400).json(new ApiResponse(400, "account does not exist"));
  }
  const resetPasswordToken = crypto.randomBytes(32).toString("hex");
const tokenExpireTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
  console.log(resetPasswordToken,"-------------breake---------------")
  console.log(tokenExpireTime,'tokenExpireTime ')

  const url = `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`;
  
  await db.user.update({
    where: { id: user.id },
    data: {
      forgotPasswordToken: resetPasswordToken,
      forgotPasswordExpiry: tokenExpireTime,
    },
  });

  const forgotPassContent = forgotPasswordMailGenContent(user.name, url);
  const options = {
    email: user.email,
    subject: "reset your password",
    mailGenContent: forgotPassContent,
    name: user.name,
  };
  await sendMail(options);
  return res
    .status(200)
    .json(
      new ApiResponse(200, "An email has been sent to reset your password"),
    );
});


// reset password
 const resetPassword = asyncHandler(async (req, res) => {
const {token}=req.params;
  const { newPassword } = req.body;
  console.log(token)
  console.log(newPassword)
  

  if (!token || !newPassword) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Password and token are required"));
  }

  
  const user = await db.user.findFirst({
    where: {
      forgotPasswordToken: token,
      forgotPasswordExpiry: {
        gt: new Date(),
      },
    },
  });

  console.log(user,'value in user--------')
  if (!user) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Token is invalid or has expired"));
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await db.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      forgotPasswordToken: null,
      forgotPasswordExpiry: null,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Password changed successfully"));
});
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
const updateProfile = async (req, res) => {
  const { email, name } = req.body;
console.log(req.body)
  try {
    const findUser = await db.user.findUnique({
      where: {
        id:req.user.id,
      },
    });

    if (!findUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const updatedUser = await db.user.update({
      where: { id: findUser.id },
      data: {
        name: name?name: findUser.name,
        email: email?email: findUser.email, // fixed: incorrect `email:email?description:...`
        role: findUser.role,
        password: findUser.password,
        image: findUser.image,
      },
    });

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ success: false, error: "Failed to update user" });
  }
};

export { register, login, logout, check,updateProfile,forgotPassword,resetPassword };
