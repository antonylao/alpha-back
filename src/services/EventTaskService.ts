import { AppDataSource } from "../data-source";
import { EventTask } from "../entities/EventTask";
import { Connection, EntityManager, FindManyOptions, FindOneOptions, FindOptions, FindOptionsWhere, Like, Repository } from "typeorm";

export class EventTaskService {

    private eventTaskRepository = AppDataSource.getRepository(EventTask);

    async createEventTask(eventTaskData: Partial<EventTask>): Promise<EventTask> {
        console.log('about to create event_task:', eventTaskData)
        const newEventTask = this.eventTaskRepository.create(eventTaskData);
        return await this.eventTaskRepository.save(newEventTask);
    }
    
    async insertEventTask(eventTaskData: Partial<EventTask>): Promise<any> {
      console.log('about to create event_task:', eventTaskData)
      const inserted = await this.eventTaskRepository.insert(eventTaskData)
      return inserted
  }
    
    async createManyEventTask(eventTasks: Partial<EventTask[]>): Promise<EventTask[]> {
      console.log('about to create event_task:', eventTasks)
      const newEventTask = this.eventTaskRepository.create(eventTasks);
      return this.eventTaskRepository.save(newEventTask);
  }
}