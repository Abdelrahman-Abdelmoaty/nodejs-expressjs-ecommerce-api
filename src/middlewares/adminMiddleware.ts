import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";

export const admin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ message: "No token, authorization denied" });
      return;
    }

    // Verify token and decode user ID
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as { userId: string };

      // Find user and check admin status
      const user = await User.findById((decoded as any).userId);

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      if (!user.isAdmin) {
        res.status(403).json({ message: "Access denied. Admin only." });
        return;
      }

      req.body.user = user;

      next();
      return;
    } catch (err) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }
  } catch (error) {
    console.error("Admin middleware error:", error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};
