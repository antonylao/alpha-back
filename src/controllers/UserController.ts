import { AppError, HttpCode } from "../utils/AppError"
import { NextFunction, Request, Response } from "express"
import { User } from "../entities/User"
import { UserService } from "../services/UserService";

export class UserController {
  private userService = new UserService()

  async readAllVolunteersForOrganiserVolunteerIndex(req: Request, res: Response, next: NextFunction) {
    try {
      return await this.userService.getAllVolunteers()
    } catch (error) {
      next(error)
    }
  }

  async readVolunteer(req: Request, res: Response, next: Function): Promise<{ user?: User, message: string }> {
    try {
      const user = await this.userService.getVolunteerById(+req.params.volunteer_id)
      if (!user && user === null) {
        throw new Error("pas de bénévole à l'ID: " + req.params.volunteer_id)
      } else {
        return { user, message: "On à retrouvé le bénévole!" };
      }
    } catch (err) {
      res.send(err.message)
    }
  }

  async readOrganiser(req: Request, res: Response, next: Function): Promise<{ user?: User, message: string }> {
    try {
      const user = await this.userService.getOrganiserById(+req.params.organiser_id)
      if (!user && user === null) {
        throw new Error("pas d'organisateur à l'ID: " + req.params.organiser_id)
      } else {
        return { user, message: "On à retrouvé le bénévole!" };
      }
    } catch (err) {
      res.send(err.message)
    }
  }

  async readVolunteerPassword(req: Request, res: Response, next: Function): Promise<{ user?: User, message: string }> {
    try {
      const user = await this.userService.getVolunteerChangePassword(+req.params.volunteer_id)
      if (!user && user === null) {
        throw new Error("pas de bénévole à l'ID: " + req.params.volunteer_id)
      } else {
        return { user, message: "On à retrouvé le bénévole! Vous allez pouvoir changer de mot de passe" };
      }
    } catch (err) {
      res.send(err.message)
    }
  }

  async readOrganiserPassword(req: Request, res: Response, next: Function): Promise<{ user?: User, message: string }> {
    try {
      const user = await this.userService.getOrganiserChangePassword(+req.params.organiser_id)
      if (!user && user === null) {
        throw new Error("pas d'organisateur à l'ID: " + req.params.organiser_id)
      } else {
        return { user, message: "On à retrouvé l'organisateur ! Vous allez pouvoir changer de mot de passe" };
      }
    } catch (err) {
      res.send(err.message)
    }
  }

  async updateVolunteer(req: Request, res: Response, next: Function): Promise<{ user?: User, message: string }> {
    try {
      let user = await this.userService.getVolunteerById(+req.params.volunteer_id);
      if (!user && user === undefined) {
        return { message: "pas de bénévoleà l'ID: " + req.params.volunteer_id }
      } else {
        user = await this.userService.update(user.id, req.body);
        console.log("🚀 ~ UserController ~ update ~ user:", user)
        return { user, message: "On a mis ton profile à jour!" };
      }
    } catch (err) {
      res.send(err.message)
    }
  }

  async updateOrganiser(req: Request, res: Response, next: Function): Promise<{ user?: User, message: string }> {
    try {
      let user = await this.userService.getOrganiserById(+req.params.organiser_id);
      if (!user && user === undefined) {
        return { message: "pas d'organisateur à l'ID: " + req.params.organiser_id }
      } else {
        user = await this.userService.update(user.id, req.body);
        console.log("🚀 ~ UserController ~ update ~ user:", user)
        return { user, message: "On a mis ton profile à jour!" };
      }
    } catch (err) {
      res.send(err.message)
    }
  }

  async updateVolunteerPassword(req: Request, res: Response, next: Function): Promise<{ user?: User, message: string }> {
    try {
      let user = await this.userService.getVolunteerChangePassword(+req.params.volunteer_id);
      console.log("🚀 ~ UserController ~ changePassword ~ user:", user)
      if (!user && user === undefined) {
        return { message: "pas d'organisateur à l'ID: " + req.params.volunteer_id }
      } else {
        user = await this.userService.updatePassword(user.id, req.body);
        console.log("🚀 ~ UserController ~ update ~ user:", user)
        return { user, message: "Le mot de passe est à jour! " };
      }
    } catch (err) {
      res.send(err.message)
    }
  }

  async updateOrganiserPassword(req: Request, res: Response, next: Function): Promise<{ user?: User, message: string }> {
    try {
      let user = await this.userService.getOrganiserChangePassword(+req.params.organiser_id);
      console.log("🚀 ~ UserController ~ changePassword ~ user:", user)
      if (!user && user === undefined) {
        return { message: "pas d'organisateur à l'ID: " + req.params.organiser_id }
      } else {
        user = await this.userService.updatePassword(user.id, req.body);
        console.log("🚀 ~ UserController ~ update ~ user:", user)
        return { user, message: "Le mot de passe est à jour! " };
      }
    } catch (err) {
      res.send(err.message)
    }
  }
}