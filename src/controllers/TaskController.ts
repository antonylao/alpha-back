import { Request, Response, NextFunction } from "express";
import { TaskService } from "../services/TaskService"

export class TaskController {

  private taskService = new TaskService()

  async getAllTasks(req: Request, res: Response, next: NextFunction) {
    try {
      return {
        status: 200,
        datas: await this.taskService.getAllTasks()
      }
    } catch (error) {
      next(error)
    }
  }
}