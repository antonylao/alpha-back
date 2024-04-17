import { NextFunction, Request, Response } from "express";
import { EventService } from "../services/EventService";
import { EventType } from "../entities/Event";
import { EnumUtils } from "../utils/EnumUtils";
import { VolunteerAssignment } from "../entities/VolunteerAssignment";
import { Event } from "../entities/Event";
import { HttpCode } from "../utils/AppError";


export class EventController {

  private eventService = new EventService();

  async getAllEvents(req: Request, res: Response): Promise<{ status: HttpCode, datas?: Event[], message: string }> {
    try {
      const events = await this.eventService.getAllEvents();
      console.log("🚀 ~ EventController ~ getAllEvents ~ events:", events)
      return {
        status: HttpCode.OK,
        datas: events,
        message: "On a retouvé les events!"
        // res.json(events);
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllUpcomingEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const datas = (await this.eventService.getAllUpcomingEvents()).map((obj) => {
        return { ...obj, type: EnumUtils.getKey(EventType, obj.type) }
      })

      return {
        status: 200,
        datas
      }
    } catch (error) {


      next(error)
    }
  }

  async getEventById(req: Request, res: Response): Promise<{ status: HttpCode, datas?: Event, message: string }> {
    const id = parseInt(req.params.id);
    try {
      const event = await this.eventService.getEventById(id);
      if (event) {
        console.log("🚀 ~ EventController ~ getEventById ~ event:", event)
        return {
          status: HttpCode.OK,
          datas: event,
          message: "On a retouvé l'event!"
        }
        // res.json(event);
      } else {
        res.status(404).json({ message: "Event not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async readCommentsByEventId(req: Request, res: Response, next: Function): Promise<{ status: HttpCode, datas?: VolunteerAssignment[], message: string }> {
    try {
      const event = await this.eventService.getCommentsByEventId(+req.params.event_id)
      if (!event && event === null) {
        throw new Error("pas de d'event à l'ID: " + req.params.event_id)
      } else {
        console.log("🚀 ~ EventController ~ readCommentsByEventId ~ event:", event)
        return {
          status: HttpCode.OK,
          datas: event,
          message: "On à retrouvé les commentaires!"
        }
      }
    } catch (err) {
      res.send(err.message)
    }
  }

  async readRatingsByEventId(req: Request, res: Response, next: Function): Promise<{ status: HttpCode, datas?: VolunteerAssignment[], message: string }> {
    try {
      const event = await this.eventService.getRatingsByEventId(+req.params.event_id)
      console.log("🚀 ~ EventController ~ readRatingsByEventId ~ event:", event)
      if (!event && event === null) {
        throw new Error("pas de d'event à l'ID: " + req.params.event_id)
      } else {
        console.log("🚀 ~ EventController ~ readRatingsByEventId ~ event ratings:", event)
        return {
          status: HttpCode.OK,
          datas: event,
          message: "On à retrouvé les ratings!"
        }
      }
    } catch (err) {
      res.send(err.message)
    }
  }

  async updateRatingsByEventId(req: Request, res: Response, next: Function): Promise<{ status: HttpCode, datas?: VolunteerAssignment[], message: string }> {
    try {
      const event = await this.eventService.updateRatingsFromEvent(+req.params.event_id, +req.params.task_id, +req.params.user_id, req.body)
      console.log("🚀 ~ EventController ~ updateRatingsByEventId ~ event:", event)
      if (!event && event === null) {
        throw new Error("pas de d'event à l'ID: " + req.params.event_id)
      } else {
        console.log("🚀 ~ EventController ~ updateRatingsByEventId ~ event ratings:", event)
        return {
          status: HttpCode.OK,
          datas: event,
          message: "On à mis le rating à jour!"
        }
      }
    } catch (err) {
      res.send(err.message)
    }
  }

  async updateStatusByEventId(req: Request, res: Response, next: Function): Promise<{ status: HttpCode, datas?: VolunteerAssignment[], message: string }> {
    try {
      const event = await this.eventService.updateStatusFromEvent(+req.params.event_id, +req.params.task_id, +req.params.user_id, req.body)
      console.log("🚀 ~ EventController ~ updateStatusFromEvent ~ event:", event)
      if (!event && event === null) {
        throw new Error("pas de d'event à l'ID: " + req.params.event_id)
      } else {
        console.log("🚀 ~ EventController ~ updateStatusFromEvent ~ event ratings:", event)
        return {
          status: HttpCode.OK,
          datas: event,
          message: "On à mis le status à jour!"
        }
      }
    } catch (err) {
      res.send(err.message)
    }
  }

  async createEvent(req: Request, res: Response): Promise<Response<{ status: HttpCode, datas?: Event, message: string }>> {
    try {
      const newEvent = await this.eventService.createEvent(req.body);
      // res.status(201).json(newEvent);
      return res.status(HttpCode.CREATED).send(
        {
          status: HttpCode.CREATED,
          datas: newEvent,
          message: "On à créé l'event!"
        }
      )
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateEvent(req: Request, res: Response): Promise<{ status: HttpCode, datas?: Event, message: string }> {
    const id = parseInt(req.params.event_id);
    try {
      const updatedEvent = await this.eventService.updateEvent(id, req.body);
      if (updatedEvent) {
        return {
          status: HttpCode.OK,
          datas: updatedEvent,
          message: "On à mis l'event à jour!"
        }
        // res.json(updatedEvent);
      } else {
        res.status(404).json({ message: "Event not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteEvent(req: Request, res: Response): Promise<Response<{ status: HttpCode, datas?: Event, message: string }>> {
    const id = parseInt(req.params.event_id);
    try {
      const result = await this.eventService.deleteEvent(id);
      if (result) {
        return res.status(HttpCode.NO_CONTENT).send(
          {
            status: HttpCode.NO_CONTENT,
            datas: result,
            message: "On à supprimé l'event!"
          })
        // res.json({ message: "Event deleted successfully" });
      } else {
        res.status(404).json({ message: "Event not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
