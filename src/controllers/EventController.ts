import { Request, Response } from "express";
import { EventService } from "../services/EventService";
import { VolunteerAssignmentService } from "../services/VolunteerAssignmentService";
import { VolunteerAssignment } from "../entities/VolunteerAssignment";


export class EventController {

  private eventService = new EventService();
  
  async getAllEvents(req: Request, res: Response) {
    try {
      const events = await this.eventService.getAllEvents();
      res.json(events);
      console.log("🚀 ~ EventController ~ getAllEvents ~ events:", events)
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getEventById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    try {
      const event = await this.eventService.getEventById(id);
      if (event) {
        res.json(event);
        console.log("🚀 ~ EventController ~ getEventById ~ event:", event)
      } else {
        res.status(404).json({ message: "Event not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async readCommentsByEventId(req: Request, res: Response, next: Function): Promise<{ event?: VolunteerAssignment[], message: string }> {
    try {
      const event = await this.eventService.getCommentsByEventId(+req.params.event_id)
      if (!event && event === null) {
        throw new Error("pas de d'event à l'ID: " + req.params.event_id)
      } else {
        console.log("🚀 ~ EventController ~ readCommentsByEventId ~ event:", event)
        return { event, message: "On à retrouvé les commentaires!" };
      }
    } catch (err) {
      res.send(err.message)
    }
  }

  async readRatingsByEventId(req: Request, res: Response, next: Function): Promise<{ event?: VolunteerAssignment[], message: string }> {
    try {
      const event = await this.eventService.getRatingsByEventId(+req.params.event_id)
      console.log("🚀 ~ EventController ~ readRatingsByEventId ~ event:", event)
      if (!event && event === null) {
        throw new Error("pas de d'event à l'ID: " + req.params.event_id)
      } else {
        console.log("🚀 ~ EventController ~ readRatingsByEventId ~ event ratings:", event)
        return { event, message: "On à retrouvé les ratings!" };
      }
    } catch (err) {
      res.send(err.message)
    }
  }

  async updateRatingsByEventId(req: Request, res: Response, next: Function): Promise<{ event?: VolunteerAssignment[], message: string }> {
    try {
      const event = await this.eventService.updateRatingsFromEvent(+req.params.event_id, +req.params.task_id, +req.params.user_id, req.body)
      console.log("🚀 ~ EventController ~ updateRatingsFromEvent ~ event:", event)
      if (!event && event === null) {
        throw new Error("pas de d'event à l'ID: " + req.params.event_id)
      } else {
        return { event, message: "On à retrouvé le rating!" };
        console.log("🚀 ~ EventController ~ updateRatingsFromEvent ~ event ratings:", event)
      }
    } catch (err) {
      res.send(err.message)
    }
  }

  async updateStatusByEventId(req: Request, res: Response, next: Function): Promise<{ event?: VolunteerAssignment[], message: string }> {
    try {
      const event = await this.eventService.updateStatusFromEvent(+req.params.event_id, +req.params.task_id, +req.params.user_id, req.body)
      console.log("🚀 ~ EventController ~ updateStatusFromEvent ~ event:", event)
      if (!event && event === null) {
        throw new Error("pas de d'event à l'ID: " + req.params.event_id)
      } else {
        console.log("🚀 ~ EventController ~ updateStatusFromEvent ~ event ratings:", event)
        return { event, message: "On à retrouvé le rating!" };
      }
    } catch (err) {
      res.send(err.message)
    }
  }

  async createEvent(req: Request, res: Response) {
    try {
      const newEvent = await this.eventService.createEvent(req.body);
      res.status(201).json(newEvent);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateEvent(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    try {
      const updatedEvent = await this.eventService.updateEvent(id, req.body);
      if (updatedEvent) {
        res.json(updatedEvent);
      } else {
        res.status(404).json({ message: "Event not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteEvent(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    try {
      const result = await this.eventService.deleteEvent(id);
      if (result) {
        res.json({ message: "Event deleted successfully" });
      } else {
        res.status(404).json({ message: "Event not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
