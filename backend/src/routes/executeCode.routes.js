import express from "express";
import isLoggedIn from "../middlewares/auth.middlewares.js";
import { executeCode } from "../controllers/executeCode.controllers.js";

const executionRoute = express.Router();
executionRoute.post("/", isLoggedIn, executeCode);
export default executionRoute;
