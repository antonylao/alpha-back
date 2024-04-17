import { Connection, EntityManager, FindManyOptions, FindOneOptions, FindOptions, FindOptionsWhere, Like, Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Task } from "../entities/Task";


export class TaskService {
 

  
  private taskRepository = AppDataSource.getRepository(Task);

  async getAllTasks(): Promise<Task[]> {
    return await this.taskRepository.find();
  }


 
  


 
}


