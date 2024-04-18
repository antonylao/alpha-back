import { NextFunction, Request, Response } from "express"
import jwt from 'jsonwebtoken'
import { AppError, HttpCode } from "../utils/AppError";
import { UserService } from "../services/UserService";
import { User } from "../entities/User";

export async function jwtCheck(req: Request, res: Response, next: NextFunction) {
  try {

    const token = __extractTokenFromHeaders(req)

    if (!token) {
      throw new AppError(HttpCode.BAD_REQUEST, "no token")
    }

    const payload = await jwt.verify(token, process.env.SECRET_KEY)

    //initialization user id
    const id = payload.id
    console.log("🚀 ~ jwtCheck ~ id:", id)
    //token en headers === token en BDD? non => 403
    const userService = new UserService()
    //get user
    let user: User;
    if (await userService.validVolunteerId(id)) {
      user = await userService.getVolunteerById(id)
    } else if (await userService.validOrganiserId(id)) {
      user = await userService.getOrganiserById(id)
    } else {
      throw new AppError(HttpCode.NOT_FOUND, "l'utilisateur n'existe pas")
    }

    if (token !== user.token) {
      throw new AppError(HttpCode.FORBIDDEN, "le token en BDD ne correspond pas à celui envoyé")
    }


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