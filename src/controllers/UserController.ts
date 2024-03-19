import { User } from "../entities/User"
import { Request, Response } from "express";
import { UserService } from "../services/UserService";


export class UserController {

    private userService = new UserService();


  async read(req: Request, res: Response, next: Function): Promise<{ user?: User, message: string }> {
    try {
        const user = await this.userService.getById(+req.params.user_id)
      if (user.role === 'admin') {       
        throw new Error("Vous n'avez pas accès à ce profile")
      } if (!user && user === undefined) {    
        throw new Error("pas de user à l'ID: " + req.params.user_id)
      } else {    
        return { user, message: "On à retrouvé le bénévole!" };
      }
    } catch (err) {
      res.send(err.message)
    }
  }

  async update(req: Request, res: Response, next: Function): Promise<{ user?: User, message: string }> {
    try {
      let user = await this.userService.getById(+req.params.user_id);
      if (!user && user === undefined) {
        return { message: "pas de bénévoleà l'ID: " + req.params.user_id }
      } else {
        await this.userService.update(user.id, req.body);
        console.log("🚀 ~ UserController ~ update ~ user:", user)
        return { user, message: "On a mis ton profile à jour!" };
      }
    } catch (err) {
      res.send(err.message)
    }
  }

}