import express from "express";
import dotenv from "dotenv";
import cookie from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import problemRoutes from "./routes/problems.routes.js";
import executionRoute from "./routes/executeCode.routes.js";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookie());
app.get("/", (req, res) => {
  res.send("Hello guys welcome to the leetlab");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemRoutes);
app.use("/api/v1/execute-code", executionRoute);
app.listen(process.env.PORT, () => {
  console.log("Server is running on 8080");
});
