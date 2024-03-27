import { EventTask } from "../entities/EventTask";
import { EventTaskService } from "../services/EventTaskService";
import { Request, Response } from "express";

export class EventTaskController{

    private eventTaskService = new EventTaskService()

    async readEventTaskById(req: Request, res: Response, next: Function): Promise<{ eventTask?: EventTask[], message: string }> {
        try {
          const eventTask = await this.eventTaskService.getEventTaskById(+req.params.event_id, +req.params.task_id)
          console.log("🚀 ~ EventTaskController ~ readEventTaskById ~ event:", eventTask)
          if (eventTask.length === 0) {
            throw new Error("pas de d'eventTask à l'ID: " + req.params.event_id)
          } else {
            return { eventTask, message: "On à retrouvé l'eventTask'!" };
          }
        } catch (err) {
          res.send(err.message)
        }
      }

    async updateEventTaskProgressionById(req: Request, res: Response, next: Function): Promise<{ eventTask?: EventTask[], message: string }> {
        try {
          const eventTask = await this.eventTaskService.updateEventTaskProgressionById(+req.params.event_id, +req.params.task_id, req.body)
          console.log("🚀 ~ EventTaskController ~ updateEventTaskProgressionById ~ event:", eventTask)
          if (!eventTask && eventTask === null) {
            throw new Error("pas de d'event à l'ID: " + req.params.event_id)
          } else {
            return { eventTask, message: "On à mis la tâche à jour!" };
          }
        } catch (err) {
          res.send(err.message)
        }
      }

    async updateEventTaskRequiredVolunteersById(req: Request, res: Response, next: Function): Promise<{ eventTask?: EventTask[], message: string }> {
        try {
          const eventTask = await this.eventTaskService.updateEventTaskRequiredVolunteersById(+req.params.event_id, +req.params.task_id, req.body)
          console.log("🚀 ~ EventTaskController ~ updateRatingsByEventId ~ event:", eventTask)
          if (!eventTask && eventTask === null) {
            throw new Error("pas de d'event à l'ID: " + req.params.event_id)
          } else {
            return { eventTask, message: "On à retrouvé la tâche!" };
          }
        } catch (err) {
          res.send(err.message)
        }
      }

    async deleteEventTaskById(req: Request, res: Response, next: Function): Promise<{ eventTask?: EventTask[], message: string }> {
        try {
          const eventTask = await this.eventTaskService.deleteEventTaskById(+req.params.event_id, +req.params.task_id)
          console.log("🚀 ~ EventTaskController ~ updateRatingsByEventId ~ event:", eventTask)
          if (!eventTask && eventTask === null) {
            throw new Error("pas de d'event à l'ID: " + req.params.event_id)
          } else {
            return { eventTask, message: "On à supprimé la tâche!" };
          }
        } catch (err) {
          res.send(err.message)
        }
      }
}