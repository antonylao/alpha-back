import { NextFunction, Request, Response } from "express"
import { EventTaskService } from "../services/EventTaskService"
import { EventService } from "../services/EventService"
import { AppError, HttpCode } from "../utils/AppError"

export class EventTaskController {
  private eventTaskService = new EventTaskService()
  private eventService = new EventService()

  async getUpcomingEventInfosForTaskApply(req: Request, res: Response, next: NextFunction) {
    try {
      const eventId = +req.params.eventId

      //get event data
      const event = await this.eventService.getEventById(eventId)

      //event existe? non => 404
      if (event === null || event === undefined) {
        throw new AppError(HttpCode.NOT_FOUND, "L'event n'existe pas")
      }
      //event commencé: non => 403
      if (event.startOn < new Date()) {
        throw new AppError(HttpCode.FORBIDDEN, "L'event a déjà commencé")
      }

      //get event infos
      const eventInfos = await this.eventTaskService.getUpcomingEventInfosForTaskApply(eventId)
      console.log("🚀 ~ EventController ~ getUpcomingEventInfosForTaskApply ~ eventInfos:", eventInfos)


      //renvoi
      return {
        status: HttpCode.OK,
        datas: eventInfos
      }
    } catch (error) {
      next(error)
    }
  }
}