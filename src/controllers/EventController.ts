import { NextFunction, Request, Response } from "express";
import { EventService } from "../services/EventService";

const eventService = new EventService();

export class EventController {
  async getAllEvents(req: Request, res: Response) {
    try {
      const events = await eventService.getAllEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllUpcomingEvents(req: Request, res: Response, next: NextFunction) {
    try {
      return {
        datas: await eventService.getAllUpcomingEvents(),
        status: 200,
      }
    } catch (error) {
      next(error)
    }
  }

  async getEventById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    try {
      const event = await eventService.getEventById(id);
      if (event) {
        res.json(event);
      } else {
        res.status(404).json({ message: "Event not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createEvent(req: Request, res: Response) {
    try {
      const newEvent = await eventService.createEvent(req.body);
      res.status(201).json(newEvent);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateEvent(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    try {
      const updatedEvent = await eventService.updateEvent(id, req.body);
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
      const result = await eventService.deleteEvent(id);
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
