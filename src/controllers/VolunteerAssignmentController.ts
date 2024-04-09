import { NextFunction, Request, Response } from "express"
import { VolunteerAssignmentService } from "../services/VolunteerAssignmentService"
import { Status, VolunteerAssignment } from "../entities/VolunteerAssignment";
import { AppError, HttpCode } from "../utils/AppError";
import { EventService } from "../services/EventService";

export type ReqParamIds = { volunteerId: number, eventId: number, taskId: number }
export type ReqParamIdsForCreation = { userId: number, eventId: number, taskId: number }

export class VolunteerAssignmentController {
  private volunteerAssignmentService = new VolunteerAssignmentService()


  async createPendingVolunterAssignment(req: Request, res: Response, next: NextFunction) {
    try {
      const params = req.params
      let paramsPartial: Omit<ReqParamIdsForCreation, "userId"> = {
        eventId: -1, taskId: -1
      };

      Object.keys(paramsPartial).forEach((idKey) => {
        paramsPartial[idKey] = parseInt(params[idKey], 10)
      })

      //* en utilisant ULR param
      // const paramsInt: ReqParamIdsForCreation = { ...paramsPartial, userId: +req.params.volunteerId }
      //* avec token
      const paramsInt: ReqParamIdsForCreation = { ...paramsPartial, userId: req.user.id }
      console.log("🚀 ~ VolunteerAssignmentController ~ createPendingVolunterAssignment ~ paramsInt:", paramsInt)


      const assignment = await this.volunteerAssignmentService.createPendingVolunterAssignment(paramsInt)

      return {
        status: HttpCode.CREATED,
        datas: assignment
      }
    } catch (error) {
      next(error)
    }
  }


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

  //:volunteerId
  async getFinishedAssignmentsInfo(req: Request, res: Response, next: Function) {
    try {
      const volunteerId = +req.params.volunteerId
      const finishedEvents = await this.volunteerAssignmentService.getFinishedAssignmentsInfo(volunteerId)
      console.log("🚀 ~ VolunteerAssignmentController ~ getFinishedAssignmentsInfo ~ finishedEvents:", finishedEvents)

      return {
        status: HttpCode.OK,
        datas: finishedEvents
      }
    } catch (error) {
      next(error)
    }
  }

  //:eventId, :taskId
  //body: {comment: string }
  async updateComment(req: Request, res: Response, next: NextFunction) {
    try {

      //initialisation vars
      // const params = req.params
      // let paramsInt: ReqParamIds = {
      //   volunteerId: -1, eventId: -1, taskId: -1
      // };

      // Object.keys(params).forEach((idKey) => {
      //   paramsInt[idKey] = parseInt(params[idKey], 10)
      // })

      // const newComment = req.body.comment

      const params = req.params
      let paramsPartial: Omit<ReqParamIds, "volunteerId"> = {
        eventId: -1, taskId: -1
      };

      Object.keys(paramsPartial).forEach((idKey) => {
        paramsPartial[idKey] = parseInt(params[idKey], 10)
      })

      //* avec URL param
      // const paramsInt: ReqParamIds = { ...paramsPartial, volunteerId: +req.params.volunteerId }
      //* avec token
      const paramsInt: ReqParamIds = { ...paramsPartial, volunteerId: req.user.id }


      const newComment = req.body.comment


      //données valide ? 400
      if (typeof newComment !== "string" || newComment.length === 0) {
        throw new AppError(HttpCode.BAD_REQUEST, "Le commentaire n'est pas valide")
      }
      //récup data 
      const assignment = await this.volunteerAssignmentService.getAssignmentForUpdate(paramsInt)
      console.log("🚀 ~ VolunteerAssignmentController ~ updateComment ~ assignment:", assignment)
      //data existe? non => 404
      if (assignment === null || assignment === undefined) {
        throw new AppError(HttpCode.NOT_FOUND, "La donnée n'existe pas")
      }
      //event terminé et assignment is accepted et comment === null? non => 403
      if (!EventService.eventFinished({ date: assignment.startOn, duration: assignment.duration }) || assignment.status !== Status.ACCEPTED.toString() || assignment.volunteerComment !== null) {
        throw new AppError(HttpCode.FORBIDDEN, "Vous ne pouvez pas appliquer de commentaire pour cet event")
      }
      //modif BDD
      const updatedAssignment = await this.volunteerAssignmentService.update({ id: assignment.id, volunteerComment: newComment })
      //renvoi donnée: 200
      return {
        status: HttpCode.OK,
        datas: updatedAssignment,
      }

    } catch (error) {
      next(error)
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

      const newRating = req.body.rating
      //data verification
      if (!Number.isInteger(newRating) || newRating < 1 || newRating > 5) {
        throw new AppError(HttpCode.BAD_REQUEST, "Le rating n'est pas valide")
      }

      //get data with {rating, eventStartOn, eventDuration}
      const assignment = await this.volunteerAssignmentService.getAssociatedEventDateAndDuration(paramsInt)

      //assignment doesn't exist => 
      if (assignment === null || assignment === undefined) {
        throw new AppError(HttpCode.NOT_FOUND, "La donnée n'existe pas")
      }

      //event not finished or event already rated => 403
      if (!EventService.eventFinished({ date: assignment.startOn, duration: assignment.duration }) || assignment.organiserRating !== null) {
        console.log(!EventService.eventFinished({ date: assignment.startOn, duration: assignment.duration }));
        console.log(assignment.organiserRating !== null);


        throw new AppError(HttpCode.FORBIDDEN, "Vous ne pouvez pas appliquer une note à cet événement")
      }

      //modif BDD  //renvoie de la donnée: body: code 200
      return await this.volunteerAssignmentService.update({ id: assignment.id, organiserRating: newRating })
    } catch (error) {
      next(error)
    }
  }

  async cancelAssignment(req: Request, res: Response, next: NextFunction) {
    try {
      //initialisation vars
      const params = req.params
      let paramsPartial: Omit<ReqParamIds, "volunteerId"> = {
        eventId: -1, taskId: -1
      };

      Object.keys(paramsPartial).forEach((idKey) => {
        paramsPartial[idKey] = parseInt(params[idKey], 10)
      })

      //* avec URL param
      // const paramsInt: ReqParamIds = { ...paramsPartial, volunteerId: +req.params.volunteerId }
      //* avec token
      const paramsInt: ReqParamIds = { ...paramsPartial, volunteerId: req.user.id }

      //récup data 
      const assignment = await this.volunteerAssignmentService.getAssignmentForUpdate(paramsInt)
      console.log("🚀 ~ VolunteerAssignmentController ~ updateComment ~ assignment:", assignment)
      //data existe? non => 404
      if (assignment === null || assignment === undefined) {
        throw new AppError(HttpCode.NOT_FOUND, "La donnée n'existe pas")
      }

      //event non commencé && assignment validé ou pending? non => 403

      if (assignment.startOn < new Date() || ![Status.ACCEPTED.toString(), Status.PENDING.toString()].includes(assignment.status)) {
        throw new AppError(HttpCode.FORBIDDEN, "Le statut ne peut pas être annulé car l'event a déjà commencé, ou le statut initial ne le permet pas")
      }
      //modif BDD
      const updatedAssignment = await this.volunteerAssignmentService.update({ id: assignment.id, status: Status.CANCELED })
      //renvoi donnée: 200
      return {
        status: HttpCode.OK,
        datas: updatedAssignment,
      }
    } catch (error) {
      next(error)
    }

  }
}