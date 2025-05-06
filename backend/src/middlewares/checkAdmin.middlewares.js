import { db } from "../libs/db.js";

const checkAdmin = async (req, res, next) => {
  try {
    const userId = req.user.id;
    console.log({
      "check admin middleware req.user(line no.7)": req.user,
    });

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        role: true,
      },
    });

    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Access denied - Admins Only",
      });
    }
    req.user = { ...user, userId };
    console.log({
      "check admin middleware req.user (line no.28)": req.user,
    });
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Error checking admin role",
      error: error.message,
    });
  }
};
export default checkAdmin;
