import { UserService } from "../services/UserService"
import { AppError, HttpCode } from "../utils/AppError"
import { NextFunction, Request, Response } from "express"

export class UserController {
  private userService = new UserService()
  async readAllVolunteersForOrganiserVolunteerIndex(req: Request, res: Response, next: NextFunction) {
    try {
      return await this.userService.getAllVolunteers()
    } catch (error) {
      next(error)
    }
  }
}