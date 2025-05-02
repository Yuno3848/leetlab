import express from "express";
import {
  check,
  login,
  logout,
  register,
} from "../controllers/reigster.controllers.js";
import isLoggedIn from "../middlewares/auth.middlewares.js";
const authRoutes = express.Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/logout", isLoggedIn, logout);
authRoutes.get("/check", isLoggedIn, check);
export default authRoutes;
