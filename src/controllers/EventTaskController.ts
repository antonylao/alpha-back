

import {Task} from "../entities/Task";
import {Repository} from "typeorm";
import {Event} from "../entities/Event";

import {TaskService} from "../services/TaskService";
import {NextFunction, Request, Response} from "express"
import {EventTaskService} from "../services/EventTaskService"
import {EventService} from "../services/EventService"
import {AppError, HttpCode} from "../utils/AppError"
import {EventTask} from "../entities/EventTask";

export class EventTaskController {
  private eventTaskService = new EventTaskService()
  private taskService = new TaskService()

  private eventService = new EventService()
  private eventRepository: Repository<Event>
  private taskRepository: Repository<Task>


  async createEventTask(req: Request, res: Response) {
    try {
      console.log(await this.taskService.getTaskByName('Billeterie'))
      const taskId = (await this.taskService.getTaskByName('Billeterie')).id;
      console.log(taskId)
      const {eventId, selectedInfos, task} = req.body;
      console.log("req.body is: " + eventId, '________', selectedInfos)
      const event = await this.eventRepository.findOne({where: {id: eventId}});
      // Récupérer la liste des tâches disponibles
      const tasks = await this.taskRepository.find();

      // Mapper les noms de tâches aux ID correspondants
      const taskNameToIdMap = tasks.reduce((map, task) => {
        map[task.name] = task.id;
        return map;
      }, {});

      // Créer les données des tâches de l'événement à partir des noms de tâches sélectionnées
      const eventTasksData = Object.entries(selectedInfos).map(([taskName, count]) => ({
        event: event,
        // event: eventId as number, 
        taskId: taskNameToIdMap[taskName], // Utiliser l'ID correspondant à partir du nom de la tâche
        nbVolunteersRequired: count as number
      }));

      // Enregistrer les données des tâches de l'événement dans la base de données
      const eventTasks = await Promise.all(eventTasksData.map(eventTaskData => this.eventTaskService.createEventTask(eventTaskData)));

      res.status(201).json(eventTasks);
    } catch (error) {
      console.error("Error creating event tasks:", error);
      res.status(500).json({message: "Failed to create event tasks"});
    }
  }



  async getUpcomingEventInfosForTaskApply(req: Request, res: Response, next: NextFunction) {
    try {
      const volunteerId = req.user.id
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
      const eventInfos = await this.eventTaskService.getUpcomingEventInfosForTaskApply(eventId, volunteerId)

      //renvoi
      return {
        status: HttpCode.OK,
        datas: eventInfos
      }
    } catch (error) {
      next(error)
    }
  }


  async readEventTaskById(req: Request, res: Response, next: Function): Promise<{status: HttpCode, datas?: EventTask[], message: string}> {
    try {
      const eventTask = await this.eventTaskService.getEventTaskById(+req.params.event_id, +req.params.task_id)
      console.log("🚀 ~ EventTaskController ~ readEventTaskById ~ event:", eventTask)
      if (eventTask.length === 0) {
        throw new Error("pas de d'eventTask à l'ID: " + req.params.event_id)
      } else {
        return {
          status: HttpCode.OK,
          datas: eventTask,
          message: "On à retrouvé l'eventTask!"
        }
      }
    } catch (err) {
      res.send(err.message)
    }
  }

  async updateEventTaskProgressionById(req: Request, res: Response, next: Function): Promise<{status: HttpCode, datas?: EventTask[], message: string}> {
    try {
      const eventTask = await this.eventTaskService.updateEventTaskProgressionById(+req.params.event_id, +req.params.task_id, req.body)
      console.log("🚀 ~ EventTaskController ~ updateEventTaskProgressionById ~ event:", eventTask)
      if (!eventTask && eventTask === null) {
        throw new Error("pas de d'event à l'ID: " + req.params.event_id)
      } else {
        return {
          status: HttpCode.OK,
          datas: eventTask,
          message: "On à mis la tâche à jour!"
        }
      }
    } catch (err) {
      res.send(err.message)
    }
  }

  async updateEventTaskRequiredVolunteersById(req: Request, res: Response, next: Function): Promise<{status: HttpCode, datas?: EventTask[], message: string}> {
    try {
      const eventTask = await this.eventTaskService.updateEventTaskRequiredVolunteersById(+req.params.event_id, +req.params.task_id, req.body)
      console.log("🚀 ~ EventTaskController ~ updateRatingsByEventId ~ event:", eventTask)
      if (!eventTask && eventTask === null) {
        throw new Error("pas de d'event à l'ID: " + req.params.event_id)
      } else {
        return {
          status: HttpCode.OK,
          datas: eventTask,
          message: "On à mis la tâche à jour!"
        }
      }
    } catch (err) {
      res.send(err.message)
    }
  }

  async deleteEventTaskById(req: Request, res: Response, next: Function): Promise<Response<{status: HttpCode, datas?: EventTask[], message: string}>> {
    try {
      const eventTask = await this.eventTaskService.deleteEventTaskById(+req.params.event_id, +req.params.task_id)
      console.log("🚀 ~ EventTaskController ~ updateRatingsByEventId ~ event:", eventTask)
      if (!eventTask && eventTask === null) {
        throw new Error("pas de d'event à l'ID: " + req.params.event_id)
      } else {
        return res.status(HttpCode.NO_CONTENT).send(
          {
            status: HttpCode.NO_CONTENT,
            datas: eventTask,
            message: "On à supprimé la tâche!"
          })
      }
    } catch (err) {
      res.send(err.message)
    }
  }
}

