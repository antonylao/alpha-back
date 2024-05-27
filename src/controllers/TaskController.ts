


import { TaskService } from "../services/TaskService";
import { Request, Response, NextFunction } from "express";

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





// export class TaskController {

//   private taskService = new TaskService()

//   async getAllTasks(req: Request, res: Response, next: NextFunction) {
//     try {
//       return {
//         status: 200,
//         datas: await this.taskService.getAllTasks()
//       }
//     } catch (error) {
//       next(error)
//     }
//   }
// }

