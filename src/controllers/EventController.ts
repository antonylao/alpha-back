import { NextFunction, Request, Response } from "express";
import { EventService } from "../services/EventService";
import { EventType } from "../entities/Event";
import { upload } from "../multerConfig";
import { User } from "../entities/User";
import { getRepository } from "typeorm";
import { UserService } from "../services/UserService";
import { AppDataSource } from "../data-source";
import { EventTask, Progression } from "../entities/EventTask";
import { Task } from "../entities/Task";
import { EventTaskService } from "../services/EventTaskService";
import { TaskService } from "../services/TaskService";
import { HttpCode } from "../utils/AppError";
import { EnumUtils } from "../utils/EnumUtils";
import { VolunteerAssignment } from "../entities/VolunteerAssignment";
import { Event } from "../entities/Event";








const eventService = new EventService();
const eventTaskService = new EventTaskService()
const taskService = new TaskService()

const { sendEmail } = require('../services/EmailService');

export class EventController {

  private eventService = new EventService();

  static createEvent(
    req: Request<
      import("express-serve-static-core").ParamsDictionary,
      any,
      any,
      import("qs").ParsedQs,
      Record<string, any>
    >,
    res: Response<any, Record<string, any>>
  ) {
    throw new Error("Method not implemented.");
  }

  //! DO NOT DELETE
  // async createEvent(req: Request, res: Response): Promise<Response<{ status: HttpCode, datas?: Event, message: string }>> {
  //   try {
  //     const newEvent = await this.eventService.createEvent(req.body);
  //     // res.status(201).json(newEvent);
  //     return res.status(HttpCode.CREATED).send(
  //       {
  //         status: HttpCode.CREATED,
  //         datas: newEvent,
  //         message: "On à créé l'event!"
  //       }
  //     )
  //   } catch (error) {
  //     res.status(500).json({ message: error.message });
  //   }
  // }









  async getAllEvents(req: Request, res: Response): Promise<{ status: HttpCode, datas?: Event[], message: string }> {

    try {
      const events = await this.eventService.getAllEvents();
      // console.log("🚀 ~ EventController ~ getAllEvents ~ events:", events)
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
      return {
        status: 200,
        datas: await this.eventService.getAllUpcomingEvents()
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
        // console.log("🚀 ~ EventController ~ getEventById ~ event:", event)
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

  async readCommentsByEventId(req: Request, res: Response, next: Function): Promise<{ status: HttpCode, datas?: VolunteerAssignment[], message: string }> {
    try {
      const event = await this.eventService.getCommentsByEventId(+req.params.event_id)
      if (!event && event === null) {
        throw new Error("pas de d'event à l'ID: " + req.params.event_id)
      } else {
        // console.log("🚀 ~ EventController ~ readCommentsByEventId ~ event:", event)
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
      // console.log("🚀 ~ EventController ~ readRatingsByEventId ~ event:", event)
      if (!event && event === null) {
        throw new Error("pas de d'event à l'ID: " + req.params.event_id)
      } else {
        // console.log("🚀 ~ EventController ~ readRatingsByEventId ~ event ratings:", event)
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
      // console.log("🚀 ~ EventController ~ updateRatingsByEventId ~ event:", event)
      if (!event && event === null) {
        throw new Error("pas de d'event à l'ID: " + req.params.event_id)
      } else {
        // console.log("🚀 ~ EventController ~ updateRatingsByEventId ~ event ratings:", event)
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
      // console.log("🚀 ~ EventController ~ updateStatusFromEvent ~ event:", event)
      if (!event && event === null) {
        throw new Error("pas de d'event à l'ID: " + req.params.event_id)
      } else {
        // console.log("🚀 ~ EventController ~ updateStatusFromEvent ~ event ratings:", event)
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

  //   async createEvent(req: Request, res: Response): Promise<Response<{ status: HttpCode, datas?: Event, message: string }>> {
  //     try {
  //       const newEvent = await this.eventService.createEvent(req.body);
  //       // res.status(201).json(newEvent);
  //       return res.status(HttpCode.CREATED).send(
  //         {
  //           status: HttpCode.CREATED,
  //           datas: newEvent,
  //           message: "On à créé l'event!"
  //         }
  //       )
  // }



  async getEventByType(req: Request, res: Response) {
    const typeParam = +req.params.type;
    console.log(" type du param: " + typeParam);
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
    upload.single("picture")(req, res, async (err: any) => {
      if (err) {
        console.error("message on upload error: " + err);
        res.status(500).json({ message: err.message });
      } else {
        try {

          const eventData = { ...req.body };
          if (req.file) {
            eventData.picture = req.file.filename;
          }

          const userRepository = AppDataSource.getRepository(User);


          const users = await userRepository.find();

          console.log('les users: ' + users)


          users.forEach(user => {
            sendEmail(user.email, user.role, 'created');
          });

          const newEvent = await eventService.createEvent(eventData);
          const eventId = newEvent.id

          const eventTasksToCreate = JSON.parse(eventData.selectedTasks || '[]')  // JSON


          if (eventTasksToCreate && eventTasksToCreate.length > 0) {



            for (const eventTask of eventTasksToCreate) {

              console.log('getting task by id:', eventTask.id)
              const task = await taskService.getTaskById(eventTask.id)
              const formattedEventTask = {
                nbVolunteersRequired: eventTask.quantity,
                progression: Progression.NOT_STARTED,
                event: newEvent,
                task,
              }

              console.log(formattedEventTask)

              const createOneEventTask = await eventTaskService.insertEventTask(formattedEventTask)

              console.log('createOneEventTask: ', createOneEventTask)
            }



          }




          res.status(201).json(newEvent);
        } catch (error) {
          res.status(500).json({ message: error.message });
          console.error("message ici: " + error);
        }
      }
    });
  }






  async updateEvent(req: Request, res: Response) {
    const handleUpload = upload.single('picture');

    handleUpload(req, res, async (err: any) => {
      if (err) {
        console.error("message on upload error: " + err);
        return res.status(500).json({ message: err.message });
      }

      const id = parseInt(req.params.id);
      console.log('valeur de req params id: ' + JSON.stringify(req.params))
      console.log("ID de l'événement à mettre à jour : ", id);
      console.log("Données reçues dans le corps de la requête : ", req.body);

      if (req.file) {
        console.log("Fichier reçu : ", req.file);
      }
      if (req.files) {
        console.log("Fichiers reçus : ", req.files);
      }

      try {
        const eventData = { ...req.body };
        if (req.file) {
          eventData.picture = req.file.filename;
        }

        const updatedEvent = await eventService.updateEvent(id, eventData);

        if (updatedEvent) {
          const eventTasksToUpdate = JSON.parse(eventData.selectedTasks || '[]');

          if (eventTasksToUpdate && eventTasksToUpdate.length > 0) {
            for (const eventTask of eventTasksToUpdate) {
              console.log('getting task by id:', eventTask.id);
              const task = await taskService.getTaskById(eventTask.id);

              const formattedEventTask = {
                nbVolunteersRequired: eventTask.quantity,
                progression: Progression.NOT_STARTED,
                event: updatedEvent,
                task,
              };

              console.log(formattedEventTask);


            }
          }

          const userRepository = AppDataSource.getRepository(User);
          const users = await userRepository.find();

          users.forEach(user => {
            sendEmail(user.email, user.role, updatedEvent.id, 'updated');
          });

          console.log("Evénement mis à jour avec succès : ", updatedEvent);
          return res.json(updatedEvent);
        } else {
          return res.status(404).json({ message: "Event not found" });
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'événement : ", error);
        return res.status(500).json({ message: error.message });
      }
    });
  }



  //   async deleteEvent(req: Request, res: Response) {
  //     const id = parseInt(req.params.id);
  // // =======
  async deleteEvent(req: Request, res: Response): Promise<Response<{ status: HttpCode, datas?: Event, message: string }>> {
    console.log('je rentre dans la fonction delete')
    const id = parseInt(req.params.id);

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



