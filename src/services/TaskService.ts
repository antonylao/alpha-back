import { AppDataSource } from "../data-source";
import { Task } from "../entities/Task";

export class TaskService {
  private taskRepository = AppDataSource.getRepository(Task);

  async getAllTasks() {
    try {
      return await this.taskRepository.find();
    } catch (error) {
      throw error
    }
  }
}