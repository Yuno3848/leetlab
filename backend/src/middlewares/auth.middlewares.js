import cookie from "cookie-parser";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;

    if (!token) {
      return res.status(401).json({
        status: "failed",
        message: "token not found",
      });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    console.log("is logged in middleware(auth middleware)", req.user);

    //{}
    next();
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Internal Server Problem",
      error: error.message,
    });
  }
};
export default isLoggedIn;
