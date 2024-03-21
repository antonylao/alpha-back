import { User } from "../entities/User"
import { Request, Response } from "express";
import { UserService } from "../services/UserService";


export class UserController {

    private userService = new UserService();


//   async read(req: Request, res: Response, next: Function): Promise<{ user?: User, message: string }> {
//     try {
//         const user = await this.userService.getById(+req.params.user_id)
//       if (user.role === 'admin') {       
//         throw new Error("Vous n'avez pas accès à ce profile")
//       } 
//       else if (!user && user === undefined) {    
//         throw new Error("pas de user à l'ID: " + req.params.user_id)
//       } else {    
//         return { user, message: "On à retrouvé le bénévole!" };
//       }
//     } catch (err) {
//       res.send(err.message)
//     }
//   }

  async readPassword(req: Request, res: Response, next: Function): Promise<{ user?: User, message: string }> {
    try {
        const user = await this.userService.getChangePassword(+req.params.volunteer_id)
       if (!user && user === null) {    
        throw new Error("pas de bénévole à l'ID: " + req.params.volunteer_id)
      } else {    
        return { user, message: "On à retrouvé le bénévole! Vous allez pouvoir changer de mot de passe" };
      }
    } catch (err) {
      res.send(err.message)
    }
  }
  
  async changePassword(req: Request, res: Response, next: Function): Promise<{ user?: User, message: string }> {
    try {
      let user = await this.userService.getChangePassword(+req.params.volunteer_id);
      console.log("🚀 ~ UserController ~ changePassword ~ user:", user)
      if (!user && user === undefined) {
        return { message: "pas de bénévoleà l'ID: " + req.params.volunteer_id }
      } else {
        user = await this.userService.updatePassword(user.id, req.body);
        console.log("🚀 ~ UserController ~ update ~ user:", user)
        return { user, message: "Le mot de passe est à jour! " };
      }
    } catch (err) {
      res.send(err.message)
    }
  }

  async read(req: Request, res: Response, next: Function): Promise<{ user?: User, message: string }> {
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

  async update(req: Request, res: Response, next: Function): Promise<{ user?: User, message: string }> {
    try {
      let user = await this.userService.getById(+req.params.volunteer_id);
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

}