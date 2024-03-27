import { NextFunction, Request, Response } from "express"
import { VolunteerAssignmentService } from "../services/VolunteerAssignmentService"
import { VolunteerAssignment } from "../entities/VolunteerAssignment";
import { HttpCode } from "../utils/AppError";


export class VolunteerAssignmentController {
  private volunteerAssignmentService = new VolunteerAssignmentService()

  async readPastEventsInfoForOrganiserVolunteerCard(req: Request, res: Response, next: NextFunction): Promise<{ status: HttpCode, datas?: VolunteerAssignment[], message: string }> {
    try {
      const pastEvent = await this.volunteerAssignmentService.getPastEventsInfoForOrganiserVolunteerCard(+req.params.volunteerId)
      return {
        status: HttpCode.OK,
        datas: pastEvent,
        message: "On à retrouvé les infos de l'event!"
      }
    } catch (error) {
      next(error)
    }
  }

  async readAllComments(req: Request, res: Response, next: Function): Promise<{ status: HttpCode, datas?: VolunteerAssignment[], message: string }> {
    try {
      const comments = await this.volunteerAssignmentService.getAllComments()

      if (!comments && comments === null) {
        throw new Error("il n'y a pas encore de commentaires")
      } else {
        console.log("🚀 ~ VolunteerAssignmentController ~ readAllComments ~ comments:", comments)
        return {
          status: HttpCode.OK,
          datas: comments,
          message: "On à retrouvé les commentaires!"
        }
      }
    } catch (err) {
      res.send(err.message)
    }
  }

  async readAllPendingRequests(req: Request, res: Response, next: Function): Promise<{ status: HttpCode, datas?: VolunteerAssignment[], message: string }> {
    try {
      const pendingRequest = await this.volunteerAssignmentService.getAllPendingRequests()

      if (!pendingRequest && pendingRequest === null) {
        throw new Error("il n'y a pas encore de commentaires")
      } else {
        console.log("🚀 ~ VolunteerAssignmentController ~ readAllPendingRequests ~ pendingRequest:", pendingRequest)
        return {
          status: HttpCode.OK,
          datas: pendingRequest,
          message: "On à retrouvé les requêtes en cours!"
        }
      }
    } catch (err) {
      res.send(err.message)
    }
  }
}