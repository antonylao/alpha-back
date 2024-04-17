import { Request, Response } from "express";
import { EventService } from "../services/EventService";
import { EventType } from "../entities/Event";
import { upload } from "../multerConfig";

const eventService = new EventService();

export class EventController {
    static createEvent(req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) {
        throw new Error("Method not implemented.");
    }
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

  //  async createEvent(req: Request, res: Response) {
  //   try {
  //     const newEvent = await eventService.createEvent(req.body);
  //     res.status(201).json(newEvent);
  //   } catch (error) {
  //     res.status(500).json({ message: error.message });
  //   }
  // }

  async createEvent(req: Request, res: Response) {
    upload.single("picture")(req, res, async (err: any) => {
      if (err) {
          res.status(500).json({ message: err.message });
          console.log("message: " + err)
      } else {
          try {
              const eventData = req.body;
              if (req.file) {
                  eventData.picture = req.file.filename;
              }
              const newEvent = await eventService.createEvent(eventData);
              res.status(201).json(newEvent);
          } catch (error) {
              res.status(500).json({ message: error.message });
              console.log("message: " + error)
          }
      }
  });
}
  
  

   async updateEvent(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    console.log("ID de l'événement à mettre à jour : ", id);
    console.log("Données reçues dans le corps de la requête : ", req.body);
    try {
      const updatedEvent = await eventService.updateEvent(id, req.body);
      if (updatedEvent) {
        console.log("Evénement mis à jour avec succès : ", updatedEvent);
        res.json(updatedEvent);
        console.log("update: " + updatedEvent)
        
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


