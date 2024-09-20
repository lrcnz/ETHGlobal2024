import { NextFunction, Request, Response } from "express";

export function ping (
  request: Request,
  response: Response,
  next: NextFunction
) {
  response.send("pong");

  next();
}