import { Request, Response } from "express";
import { EventTaskService } from "../services/EventTaskService";
import { Task } from "../entities/Task";
import { Repository } from "typeorm";
import { Event } from "../entities/Event";
import { EventTask } from "../entities/EventTask";
import { TaskService } from "../services/TaskService";

export class EventTaskController {
 private eventTaskService = new EventTaskService()
 private taskService = new TaskService()
  private eventRepository: Repository<Event>
  private taskRepository: Repository<Task>
  
  
  async createEventTask(req: Request, res: Response) {
    try {
        console.log( await this.taskService.getTaskByName('Billeterie'))
        const taskId = (await this.taskService.getTaskByName('Billeterie')).id;
        console.log(taskId)
      const { eventId, selectedInfos, task } = req.body;
      console.log( "req.body is: "+ eventId,'________', selectedInfos)
      const event = await this.eventRepository.findOne({where:{id: eventId}});
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
      res.status(500).json({ message: "Failed to create event tasks" });
    }
  }
}
