import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/AuthService";
import { UserService } from "../services/UserService";
import { Role, User } from "../entities/User";
import { AppError, HttpCode } from "../utils/AppError";
import bcrypt from 'bcrypt';

export class AuthController {
  private authService = new AuthService();
  private userService = new UserService();

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      //initialization vars
      console.log("🚀 ~ AuthController ~ refreshToken ~ req.user:", req.user)
      const id = await req.user.id
      //!refreshToken stocké dans le user correspond au refreshToken envoyé?

      //get user
      let user: User;
      if (await this.userService.validVolunteerId(id)) {
        user = await this.userService.getVolunteerById(id)
        console.log("🚀 ~ AuthController ~ refreshToken ~ user:", user)
      } else if (await this.userService.validOrganiserId(id)) {
        user = await this.userService.getOrganiserById(id)
        console.log("🚀 ~ AuthController ~ refreshToken ~ user:", user)
      } else {
        throw new AppError(HttpCode.NOT_FOUND, "l'utilisateur n'existe pas")
      }


      //creation token et refreshToken
      const token = this.authService.createToken({ id: user.id }, process.env.SECRET_KEY, process.env.DURATION_TOKEN)
      console.log("🚀 ~ AuthController ~ refreshToken ~ token:", token)
      const refreshToken = this.authService.createToken({ id: user.id }, process.env.REFRESH_SECRET_KEY, process.env.DURATION_REFRESH_TOKEN)
      console.log("🚀 ~ AuthController ~ refreshToken ~ refreshToken:", refreshToken)
      return {
        status: HttpCode.CREATED,
        datas: { user, token, refreshToken }
      }
    } catch (error) {
      console.log("🚀 ~ AuthController ~ refreshToken ~ next(error):", next(error))
      next(error)
      // res.send(error.message)
    }
  }

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

      const token = this.authService.createToken({ id: user.id }, process.env.SECRET_KEY, process.env.DURATION_TOKEN)
      const refreshToken = this.authService.createToken({ id: user.id }, process.env.REFRESH_SECRET_KEY, process.env.DURATION_REFRESH_TOKEN)
      return {
        status: HttpCode.CREATED,
        datas: { user, token, refreshToken }
      }
    } catch (error) {
      next(error)
    }
  }

  async registerVolunteer(req: Request, res: Response, next: NextFunction) {
    try {
      //initialisation variables
      let password = req.body.password
      //!vérifications: types du body, contraintes sur mdp, firstname, lastname, email, phone : non => erreur 400

      //vérifier que le mail n'existe pas en BDD: non => erreur 409
      const user = await this.userService.getByEmail(req.body.email, Role.VOLUNTEER)
      if (user) {
        throw new AppError(HttpCode.CONFLICT, "Adresse mail déjà utilisée")
      }

      password = await bcrypt.hash(password, 10);

      req.body.password = password

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