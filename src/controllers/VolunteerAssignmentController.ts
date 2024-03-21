import { NextFunction, Request, Response } from "express"
import { VolunteerAssignmentService } from "../services/VolunteerAssignementService"

export class VolunteerAssignmentController {
  private volunteerAssignmentService = new VolunteerAssignmentService()
  async readPastEventsInfoForOrganiserVolunteerCard(req: Request, res: Response, next: NextFunction) {
    try {
      return await this.volunteerAssignmentService.getPastEventsInfoForOrganiserVolunteerCard(+req.params.volunteerId)
    } catch (error) {
      next(error)
    }
  }
}