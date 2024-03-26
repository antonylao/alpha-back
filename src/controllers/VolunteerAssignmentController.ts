import { NextFunction, Request, Response } from "express"
import { VolunteerAssignmentService } from "../services/VolunteerAssignmentService"
import { VolunteerAssignment } from "../entities/VolunteerAssignment";


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
        console.log("🚀 ~ VolunteerAssignmentController ~ readAllComments ~ comments:", comments[0].eventTask.event.id)
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
}