import { NextFunction, Request, Response } from "express";
import { AppError } from "./errorMiddleware";
import jwt from "jsonwebtoken";
import { Role, User } from "../entity/user.entity";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const header = req.get("Authorization");
  if (!header) throw new AppError("Authentication token missing", 401);

  const token = header.split(" ")[1];

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET) as {
      id: number;
      email: string;
      role: Role;
      name: string;
      createdDate: Date;
    };
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError("Invalid token", 401));
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError("Token expired", 401));
    }
    // For any other unexpected errors during verification
    return next(new AppError("Not authorized, token failed", 401));
  }
}
