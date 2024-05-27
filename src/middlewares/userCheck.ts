import { NextFunction, Request, Response } from "express"
import { UserService } from "../services/UserService"
import { AppError, HttpCode } from "../utils/AppError"

const userService = new UserService()

export async function volunteerCheck(req: Request, res: Response, next: NextFunction) {
  try {
    if (!await userService.validVolunteerId(req.user.id)) {
      throw new AppError(HttpCode.FORBIDDEN, "Vous n'avez pas les droits du bénévole")
    }
    next()
  } catch (error) {
    next(error)
  }
}

export async function organiserCheck(req: Request, res: Response, next: NextFunction) {
  try {
    if (!await userService.validOrganiserId(req.user.id)) {
      throw new AppError(HttpCode.FORBIDDEN, "Vous n'avez pas les droits de l'organisateur")
    }
    next()
  } catch (error) {
    next(error)
  }
}