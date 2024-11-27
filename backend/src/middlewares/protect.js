import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const userVerify = async (req, res, next) => {
  const token = req.cookies.date;
  try {
    if (!token) {
      return res.status(401).json({ code: 0, message: "no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ code: 0, message: "Unauthorized" });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ code: 0, message: "no user unauth" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ code: 0, message: "Error in user verification" });
  }
};
