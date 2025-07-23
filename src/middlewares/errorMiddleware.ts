import { NextFunction, Request, Response } from "express";

export class AppError extends Error {
  statusCode = 500;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function errorMiddleware(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("Error", err.message);
  res
    .status(err.statusCode || 500)
    .json({ status: "error", message: err.message || "Something went wrong!" });
}
