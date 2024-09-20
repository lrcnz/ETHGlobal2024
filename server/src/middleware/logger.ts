import { NextFunction, Request, Response } from "express";
import { logger } from "../libs/logger";

export async function loggerMiddleware (
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.info(`receive ${req.method} ${req.path}`);
  next();
}