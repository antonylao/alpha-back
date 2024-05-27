import { NextFunction, Request, Response } from "express";
import { AppError, ErrorName, HttpCode } from "../utils/AppError";
export async function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) {
    return next(err)
  }

  if (err instanceof AppError) {
    res.status(err.httpCode).send(err)
    return
  }

  if (err.name === ErrorName.JWT_TOKEN_EXPIRED) {
    res.status(HttpCode.UNAUTHORIZED).send(err)
    return
  }

  console.log(err);
  const message = err.message ? err.message : err
  res.status(500).send({ message })
}