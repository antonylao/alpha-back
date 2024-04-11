import { NextFunction, Request, Response } from "express"
import { VolunteerAssignmentService } from "../services/VolunteerAssignmentService"
import { VolunteerAssignment } from "../entities/VolunteerAssignment";


const volunteerAssignmentService = new VolunteerAssignmentService();

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

  async getAllVolunteerAssignments (req: Request, res: Response) {
    try {
      const volunteerAssignments = await volunteerAssignmentService.getAllVolunteerAssignments();
      if(!volunteerAssignments){
        console.log("tableau vide")
      }
      console.log("il devrait y avoir des valeurs " + volunteerAssignments)
      res.json(volunteerAssignments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}

async createAssignment(req: Request, res: Response) {

  const userId =1;
  const eventId = 1;
  const taskId = 1

 return await this.volunteerAssignmentService.createVolunteerAssignment(1, 1,1 )
  // try {
  //   const newEvent = await eventService.createEvent(req.body);
  //   res.status(201).json(newEvent);
  // } catch (error) {
  //   res.status(500).json({ message: error.message });
  // }
  
}
}