import { AppError, HttpCode } from "../utils/AppError"
import { NextFunction, Request, Response } from "express"
import { User } from "../entities/User"
import { UserService } from "../services/UserService";


export class UserController {
  private userService = new UserService()

  async readAllVolunteersForOrganiserVolunteerIndex(req: Request, res: Response, next: NextFunction): Promise<{ status: HttpCode, datas?: User[] }> {
    try {
      return {
        status: HttpCode.OK,
        datas: await this.userService.getAllVolunteers()
      }
    } catch (error) {
      next(error)
    }
  }

  async readVolunteer(req: Request, res: Response, next: Function): Promise<{ status: HttpCode, datas?: User, message: string }> {
    try {
      const user = await this.userService.getVolunteerById(+req.user.id)
      console.log("🚀 ~ UserController ~ readVolunteer ~ user:", req.user)
      if (!user && user === null) {
        throw new Error("pas de bénévole à l'ID: " + req.user.id)
      } else {
        return {
          status: HttpCode.OK,
          datas: user,
          message: "On à retrouvé le bénévole!"
        }
      }
    } catch (err) {
      res.send(err.message)
    }
  }

  async readOrganiser(req: Request, res: Response, next: Function): Promise<{ status: HttpCode, datas?: User, message: string }> {
    try {
      const user = await this.userService.getOrganiserById(+req.user.id)
      if (!user && user === null) {
        throw new Error("pas d'organisateur à l'ID: " + req.user.id)
      } else {
        return {
          status: HttpCode.OK,
          datas: user,
          message: "On à retrouvé l'organisateur!"
        }
      }
    } catch (err) {
      res.send(err.message)
    }
  }

  async readVolunteerPassword(req: Request, res: Response, next: Function): Promise<{ status: HttpCode, datas?: User, message: string }> {
    try {
      const user = await this.userService.getVolunteerChangePassword(+req.user.id)
      if (!user && user === null) {
        throw new Error("pas de bénévole à l'ID: " + req.user.id)
      } else {
        return {
          status: HttpCode.OK,
          datas: user,
          message: "On à retrouvé le bénévole! Vous allez pouvoir changer de mot de passe"
        }
      }
    } catch (err) {
      res.send(err.message)
    }
  }

  async readOrganiserPassword(req: Request, res: Response, next: Function): Promise<{ status: HttpCode, datas?: User, message: string }> {
    try {
      const user = await this.userService.getOrganiserChangePassword(+req.user.id)
      if (!user && user === null) {
        throw new Error("pas d'organisateur à l'ID: " + req.user.id)
      } else {
        return {
          status: HttpCode.OK,
          datas: user,
          message: "On à retrouvé l'organisateur ! Vous allez pouvoir changer de mot de passe"
        }
      }
    } catch (err) {
      res.send(err.message)
    }
  }

  async updateVolunteer(req: Request, res: Response, next: Function): Promise<{ status: HttpCode, datas?: User, message: string }> {
    try {
      let user = await this.userService.getVolunteerById(+req.user.id);
      if (!user && user === undefined) {
        throw new Error("pas de bénévoleà l'ID: " + req.user.id)
      } else {
        user = await this.userService.update(user.id, req.body);
        console.log("🚀 ~ UserController ~ update ~ user:", user)
        return {
          status: HttpCode.OK,
          datas: user,
          message: "On a mis ton profile à jour!"
        }
      }
    } catch (err) {
      res.send(err.message)
    }
  }

  async updateOrganiser(req: Request, res: Response, next: Function): Promise<{ status: HttpCode, datas?: User, message: string }> {
    try {
      let user = await this.userService.getOrganiserById(+req.user.id);
      if (!user && user === undefined) {
        throw new Error("pas d'organisateur à l'ID: " + req.user.id)
      } else {
        user = await this.userService.update(user.id, req.body);
        console.log("🚀 ~ UserController ~ update ~ user:", user)
        return {
          status: HttpCode.OK,
          datas: user,
          message: "On a mis ton profile à jour!"
        }
      }
    } catch (err) {
      res.send(err.message)
    }
  }

  async updateVolunteerPassword(req: Request, res: Response, next: Function): Promise<{ status: HttpCode, datas?: User, message: string }> {
    try {
      let user = await this.userService.getVolunteerChangePassword(+req.user.id);
      console.log("🚀 ~ UserController ~ changePassword ~ user:", user)
      if (!user && user === undefined) {
        throw new Error("pas d'organisateur à l'ID: " + req.user.id)
      } else {
        user = await this.userService.updatePassword(user.id, req.body);
        console.log("🚀 ~ UserController ~ update ~ user:", user)
        return {
          status: HttpCode.OK,
          datas: user,
          message: "Le mot de passe est à jour! "
        }
      }
    } catch (err) {
      res.send(err.message)
    }
  }

  async updateOrganiserPassword(req: Request, res: Response, next: Function): Promise<{ status: HttpCode, datas?: User, message: string }> {
    try {
      let user = await this.userService.getOrganiserChangePassword(+req.user.id);
      console.log("🚀 ~ UserController ~ changePassword ~ user:", user)
      if (!user && user === undefined) {
        throw new Error("pas d'organisateur à l'ID: " + req.user.id)
      } else {
        user = await this.userService.updatePassword(user.id, req.body);
        console.log("🚀 ~ UserController ~ update ~ user:", user)
        return {
          status: HttpCode.OK,
          datas: user,
          message: "Le mot de passe est à jour! "
        }
      }
    } catch (err) {
      res.send(err.message)
    }
  }

  async applyWarning(req: Request, res: Response, next: Function) {
    try {
      const id = +req.params.volunteerId
      //récup de la data // data existe ? non: 404
      const user = await this.userService.getVolunteerById(+id)
      //modify obj
      user.warning = true
      //modify BDD
      return {
        status: HttpCode.OK,
        datas: await this.userService.update(id, user)
      }

    } catch (error) {
      next(error)
    }
  }
  async applyBan(req: Request, res: Response, next: Function) {
    try {
      const id = +req.params.volunteerId
      //récup de la data // data existe ? non: 404
      const user = await this.userService.getVolunteerById(+id)
      //modify obj
      user.ban = true
      //modify BDD
      return {
        status: HttpCode.OK,
        datas: await this.userService.update(id, user)
      }
    } catch (error) {
      next(error)
    }
  }
}