import { Request, Response } from "express";

import { TaskService } from "../services/TaskService";

const taskService = new TaskService();

export class TaskController {
    
   async getAllTasks(req: Request, res: Response) {
    try {
      const tasks = await taskService.getAllTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.log("message ", error)
    }
  }

 




}


