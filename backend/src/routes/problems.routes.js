import express from "express";
import isLoggedIn from "../middlewares/auth.middlewares.js";
import checkAdmin from "../middlewares/checkAdmin.middlewares.js";
import {
  createProblem,
  deleteProblem,
  getAllProblems,
  getAllProblemsSolvedByUser,
  getProblemById,
  updateProblemById,
} from "../controllers/problem.controllers.js";

const problemRoutes = express.Router();
problemRoutes.post("/create-problem", isLoggedIn, checkAdmin, createProblem);

problemRoutes.get("/get-all-problems", isLoggedIn, getAllProblems);

problemRoutes.get("/get-problem/:id", isLoggedIn, getProblemById);

problemRoutes.put(
  "/update-problem/:id",
  isLoggedIn,
  checkAdmin,
  updateProblemById
);

problemRoutes.delete("/delete-problem/:id", isLoggedIn, deleteProblem);

problemRoutes.get(
  "/get-solved-problems",
  isLoggedIn,
  getAllProblemsSolvedByUser
);
export default problemRoutes;
