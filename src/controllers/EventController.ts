import { Request, Response } from "express";
import { EventService } from "../services/EventService";
import { EventType } from "../entities/Event";

const eventService = new EventService();

export class EventController {
  eventService: any;
   async getAllEvents(req: Request, res: Response) {
    try {
      const events = await eventService.getAllEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: error.message });
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

// by Name, by category, by date soon, by date expired
  async getEventByTitle(req: Request, res: Response) {
  const title = req.params.title as string;
  try {
    const event = await eventService.getEventByTitle(title);
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async getEventByType(req: Request, res: Response) {
  const typeParam = +req.params.type ; 
 console.log( " type du param: " + typeParam);
  try {
    const event = await eventService.getEventByType(typeParam);
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
//utilisation ultérieure
// async getEventsByDate(req: Request, res: Response) {
//   let date: Date;
//   const dateParam = req.params.date;
  
//   if (/^\d{4}$/.test(dateParam)) {
//     date = new Date(parseInt(dateParam), 0, 1);
//     console.log("format de dateparam: "+ dateParam)
//   } else {
//     date = new Date(dateParam);
//   }
//   try {
//     const events = await eventService.getEventsByDate(date);
//     res.json(events);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }

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


