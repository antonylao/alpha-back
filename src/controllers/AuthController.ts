import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/AuthService";
import { UserService } from "../services/UserService";
import { Role, User } from "../entities/User";
import { AppError, HttpCode } from "../utils/AppError";
import bcrypt from 'bcrypt';
import { MailerService } from "../services/MailerService";


export class AuthController {
  private authService = new AuthService();
  private userService = new UserService();
  private mailerService = new MailerService();

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      //initialization vars
      const id = await req.user.id

      //get user
      let user: User;
      if (await this.userService.validVolunteerId(id)) {
        user = await this.userService.getVolunteerById(id)
      } else if (await this.userService.validOrganiserId(id)) {
        user = await this.userService.getOrganiserById(id)
      } else {
        throw new AppError(HttpCode.NOT_FOUND, "l'utilisateur n'existe pas")
      }


      //creation token et refreshToken
      const token = this.authService.createToken({ id: user.id }, process.env.SECRET_KEY, process.env.DURATION_TOKEN)
      const refreshToken = this.authService.createToken({ id: user.id }, process.env.REFRESH_SECRET_KEY, process.env.DURATION_REFRESH_TOKEN)

      //insertion tokens dans BDD
      const updatedUser = await this.userService.update(user.id, { token, refreshToken })

      return {
        status: HttpCode.CREATED,
        datas: { updatedUser, token, refreshToken }
      }
    } catch (error) {
      next(error)
    }
  }


  async loginOrganiser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.getByEmail(req.body.email, Role.ADMIN)
      if (!user || user.active === false) {
        throw new AppError(HttpCode.UNAUTHORIZED, "Identifiants non valides")
      }

      const validPassword = await bcrypt.compare(req.body.password, user.password)
      if (!validPassword) {
        throw new AppError(HttpCode.UNAUTHORIZED, "Identifiants non valides")
      }

      const token = this.authService.createToken({ id: user.id }, process.env.SECRET_KEY, process.env.DURATION_TOKEN)
      const refreshToken = this.authService.createToken({ id: user.id }, process.env.REFRESH_SECRET_KEY, process.env.DURATION_REFRESH_TOKEN)

      //insertion tokens dans BDD
      const updatedUser = await this.userService.update(user.id, { token, refreshToken })

      return {
        status: HttpCode.CREATED,
        datas: { updatedUser, token, refreshToken }
      }
    } catch (error) {
      next(error)
    }
  }

  async registerOrganiser(req: Request, res: Response, next: NextFunction) {
    try {
      //initialisation variables
      let password = req.body.password
      //!vérifications: types du body, contraintes sur mdp, email: non => erreur 400

      //vérifier que le mail n'existe pas en BDD: non => erreur 409
      const user = await this.userService.getByEmail(req.body.email, Role.ADMIN)
      if (user) {
        throw new AppError(HttpCode.CONFLICT, "Adresse mail déjà utilisée")
      }

      //hashage du mdp
      password = await bcrypt.hash(password, 10);

      //modif du body : organiser is active
      req.body.password = password
      req.body.role = Role.ADMIN
      req.body.active = true

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

  async loginVolunteer(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.getByEmail(req.body.email, Role.VOLUNTEER)
      console.log("🚀 ~ AuthController ~ loginVolunteer ~ user:", user)
      if (!user || user.active === false) {
        throw new AppError(HttpCode.UNAUTHORIZED, "Identifiants non valides")
      }

      const validPassword = await bcrypt.compare(req.body.password, user.password)
      if (!validPassword) {
        throw new AppError(HttpCode.UNAUTHORIZED, "Identifiants non valides")
      }



      const token = this.authService.createToken({ id: user.id }, process.env.SECRET_KEY, process.env.DURATION_TOKEN)
      const refreshToken = this.authService.createToken({ id: user.id }, process.env.REFRESH_SECRET_KEY, process.env.DURATION_REFRESH_TOKEN)

      //insertion tokens dans BDD
      const updatedUser = await this.userService.update(user.id, { token, refreshToken })

      return {
        status: HttpCode.CREATED,
        datas: { updatedUser, token, refreshToken }
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


      //hashage du mdp
      password = await bcrypt.hash(password, 10);


      //modif du body
      req.body.password = password

      //stocker user avec mdp hashé en BDD
      const newUser = await this.userService.create(req.body)
      console.log("🚀 ~ AuthController ~ registerVolunteer ~ body:", newUser)

      //mailer
      await this.mailerService.sendMail(
        req.body.email,
        newUser.id,
        `Confirmation d'inscription`,
        `Merci de valider votre email! http://localhost:3000/auth/signin/${newUser.id}/emailConfirmation`
      )

      // retour user
      return {
        status: HttpCode.CREATED,
        datas: newUser
      }
    } catch (error) {
      next(error)
    }
  }

  async emailConfirmation(req: Request, res: Response, next: NextFunction) {
    //initialization vars
    const id = +req.params.userId

    //get user
    let user: User;
    if (await this.userService.validVolunteerId(id)) {
      user = await this.userService.getVolunteerById(id)
    } else if (await this.userService.validOrganiserId(id)) {
      user = await this.userService.getOrganiserById(id)
    } else {
      throw new AppError(HttpCode.NOT_FOUND, "l'utilisateur n'existe pas")
    }

    //set column active to true 
    const updatedUser = await this.userService.update(user.id, { active: true })

    return {
      status: HttpCode.OK,
      datas: updatedUser
    }
  }

  async signout(req: Request, res: Response, next: NextFunction) {
    //initialization vars
    const id = await req.user.id

    //get user
    let user: User;
    if (await this.userService.validVolunteerId(id)) {
      user = await this.userService.getVolunteerById(id)
    } else if (await this.userService.validOrganiserId(id)) {
      user = await this.userService.getOrganiserById(id)
    } else {
      throw new AppError(HttpCode.NOT_FOUND, "l'utilisateur n'existe pas")
    }

    //remove data on columns token & refreshToken
    const updatedUser = await this.userService.update(user.id, { token: null, refreshToken: null })

    return {
      status: HttpCode.OK,
      datas: updatedUser
    }
  }
}