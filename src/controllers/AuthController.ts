import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/AuthService";
import { UserService } from "../services/UserService";
import { Role } from "../entities/User";
import { AppError, HttpCode } from "../utils/AppError";
import bcrypt from 'bcrypt';

export class AuthController {
  private authService = new AuthService();
  private userService = new UserService();

  async loginVolunteer(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.getByEmail(req.body.email, Role.VOLUNTEER)
      if (!user) {
        throw new AppError(HttpCode.UNAUTHORIZED, "Identifiants non valides")
      }

      const validPassword = await bcrypt.compare(req.body.password, user.password)
      if (!validPassword) {
        throw new AppError(HttpCode.UNAUTHORIZED, "Identifiants non valides")
      }

      const token = this.authService.createToken({ id: user.id })
      return { user, token }
    } catch (error) {
      next(error)
    }
  }

  async registerVolunteer(req: Request, res: Response, next: NextFunction) {
    try {
      //initialisation variables
      let password = req.body.password
      //vérifier que le mail n'existe pas en BDD
      const user = await this.userService.getByEmail(req.body.email, Role.VOLUNTEER)
      if (user) {
        throw new AppError(HttpCode.CONFLICT, "Adresse mail déjà utilisée")
      }

      //!autres vérifications: mdp, firstname, lastname, email, phone
      //hashage du mdp
      password = await bcrypt.hash(password, 10);


      //modif du body
      req.body.password = password

      //stocker user avec mdp hashé en BDD; retour user
      const newUser = await this.userService.create(req.body)
      console.log("🚀 ~ AuthController ~ registerVolunteer ~ newUser:", newUser)

      return {
        status: HttpCode.CREATED,
        datas: newUser
      }
    } catch (error) {
      next(error)
      // throw error
    }
  }
}