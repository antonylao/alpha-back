import { Connection, EntityManager, FindManyOptions, FindOneOptions, FindOptions, FindOptionsWhere, Like, Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Task } from "../entities/Task";


export class TaskService {
 

  
  private taskRepository = AppDataSource.getRepository(Task);

  async getAllTasks(): Promise<Task[]> {
    return await this.taskRepository.find();
  }

  async getTaskByName(name: string): Promise<Task | undefined> {
    const byName :FindOneOptions<Task> = {where:{name}  };
    return await this.taskRepository.findOne(byName);
  }


  async getTaskById(id: number): Promise<Task | undefined> {
    const byId :FindOneOptions<Task> = {where:{id} };
    return await this.taskRepository.findOne(byId);
  }
  


 
}


