import { NextFunction, Request, Response } from "express"
import jwt from 'jsonwebtoken'
import { AppError, HttpCode } from "../utils/AppError";

export async function jwtCheckRefresh(req: Request, res: Response, next: NextFunction) {
  try {
    const token = __extractTokenFromHeaders(req)

    if (!token) {
      throw new AppError(HttpCode.UNAUTHORIZED, "no token")
    }

    const payload = await jwt.verify(token, process.env.REFRESH_SECRET_KEY)

    req['user'] = payload
    next()
  } catch (error) {
    next(error)
  }

}

function __extractTokenFromHeaders(req: Request) {
  const [type, token] = req.headers.authorization?.split(" ") ?? [];
  return type === "Bearer" ? token : undefined
}