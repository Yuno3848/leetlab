import bcrypt from "bcryptjs";
import { db } from "../libs/db.js";
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";
import cookie from "cookie-parser";
export const register = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      return res.status(400).json({
        status: "failed",
        message: "user already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: UserRole.USER,
      },
    });
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 1000 * 60 * 60 * 24 * 7, //7 days
    });

    res.status(201).json({
      message: "user created successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        image: newUser.image,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "failed",
      message: "Internal Server Problem",
      error: error.message,
    });
  }
};
export const login = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({
        status: "failed",
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 1000 * 60 * 60 * 24 * 7, //7 days
    });

    const isPassword = bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(404).json({
        status: "failed",
        message: "Invalid Credentials",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "logged In",
      data: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Internal Server Problem",
      error: error.message,
    });
  }
};
export const logout = async (req, res) => {
  res.clearCookie();
  try {
    return res.status(400).json({
      status: "success",
      message: "User logged Out Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Internal Server Problem",
      error: error.message,
    });
  }
};
export const check = async (req, res) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        id: true,
        image: true,
        name: true,
        email: true,
        role: true,
      },
    });
    if (!user) {
      return res.status(401).json({
        status: "failed",
        message: "Internal Problem Solved",
        error: error.message,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "profile fetched successfully",
      data: {
        username: user.name,
        email: user.email,
        fullname: user.fullname,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Internal Server Problem",
      error: error.message,
    });
  }
};
