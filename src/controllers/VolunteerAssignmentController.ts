import { NextFunction, Request, Response } from "express"
import { VolunteerAssignmentService } from "../services/VolunteerAssignmentService"
import { VolunteerAssignment } from "../entities/VolunteerAssignment";
import { AppError, HttpCode } from "../utils/AppError";
import { EventService } from "../services/EventService";

export type ReqParamIds = { volunteerId: number, eventId: number, taskId: number }

export class VolunteerAssignmentController {
  private volunteerAssignmentService = new VolunteerAssignmentService()
  async readPastEventsInfoForOrganiserVolunteerCard(req: Request, res: Response, next: NextFunction) {
    try {
      return await this.volunteerAssignmentService.getPastEventsInfoForOrganiserVolunteerCard(+req.params.volunteerId)
    } catch (error) {
      next(error)
    }
  }


  async readAllComments(req: Request, res: Response, next: Function): Promise<{ comments?: VolunteerAssignment[], message: string }> {
    try {
      const comments = await this.volunteerAssignmentService.getAllComments()

      if (!comments && comments === null) {
        throw new Error("il n'y a pas encore de commentaires")
      } else {
        console.log("🚀 ~ VolunteerAssignmentController ~ readAllComments ~ comments:", comments)
        return { comments, message: "On à retrouvé les commentaires!" };
      }
    } catch (err) {
      res.send(err.message)
    }
  }

  async readAllPendingRequests(req: Request, res: Response, next: Function): Promise<{ pendingRequest?: VolunteerAssignment[], message: string }> {
    try {
      const pendingRequest = await this.volunteerAssignmentService.getAllPendingRequests()

      if (!pendingRequest && pendingRequest === null) {
        throw new Error("il n'y a pas encore de commentaires")
      } else {
        console.log("🚀 ~ VolunteerAssignmentController ~ readAllPendingRequests ~ pendingRequest:", pendingRequest)
        return { pendingRequest, message: "On à retrouvé les requêtes en cours!" };
      }
    } catch (err) {
      res.send(err.message)
    }
  }

  async updateRating(req: Request, res: Response, next: NextFunction) {
    try {
      const params = req.params
      let paramsInt: ReqParamIds = {
        volunteerId: -1, eventId: -1, taskId: -1
      };

      Object.keys(params).forEach((idKey) => {
        paramsInt[idKey] = parseInt(params[idKey], 10)
      })

      //data verification
      const newRating = req.body.rating
      if (!Number.isInteger(newRating) || newRating < 1 || newRating > 5) {
        throw new AppError(HttpCode.BAD_REQUEST, "Le rating n'est pas valide")
      }

      //get data with {rating, eventStartOn, eventDuration}
      const assignment = await this.volunteerAssignmentService.getAssociatedEventDateAndDuration(paramsInt)

      //assignment doesn't exist => 
      if (assignment === null) {
        throw new AppError(HttpCode.NOT_FOUND, "La donnée n'existe pas")
      }

      //event not finished => 403
      if (!EventService.eventFinished({ date: assignment.startOn, duration: assignment.duration })) {
        throw new AppError(HttpCode.FORBIDDEN, "Vous ne pouvez pas appliquer une note à un événmement non terminé")
      }

      //modif BDD  //renvoie de la donnée: body: code 200
      return this.volunteerAssignmentService.update({ id: assignment.id, organiserRating: newRating })
    } catch (error) {
      next(error)
    }
  }
}