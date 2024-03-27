import { AppDataSource } from "../data-source";
import { EventTask, Progression } from "../entities/EventTask";
import { Task } from "../entities/Task";
import { Event } from "../entities/Event";
import { AppError, HttpCode } from "../utils/AppError";
import { EventTaskQueries } from "../utils/queries";
import { SelectQueryBuilder } from "typeorm";

export class EventTaskService {
  private eventTaskRepository = AppDataSource.getRepository(EventTask);
  private eventRepository = AppDataSource.getRepository(Event);
  private taskRepository = AppDataSource.getRepository(Task);

  async getEventTaskById(eventId: number, taskId: number): Promise<EventTask[]> {
    try {
      const data = await this.eventTaskRepository
      .createQueryBuilder("eventTask")
      .where("eventId = :eventId", { eventId })
      .andWhere("taskId = :taskId", { taskId })
      .execute();
      console.log("🚀 ~ eventTaskRepository ~ getEventTaskById ~ test:", data)
    return data
  } catch (error) {
    throw error
  }
  }

  async updateEventTaskProgressionById(eventId: number, taskId: number, eventTaskData: Pick<EventTask, "progression">): Promise<EventTask[]> {
    try {
        const data = await AppDataSource
        .createQueryBuilder()
        .update(EventTask)
        .set(eventTaskData)
        .where("eventId = :eventId", { eventId })
        .andWhere("taskId = :taskId", { taskId })
        .execute();
        console.log("🚀 ~ EventTaskService ~ updateEventTaskProgressionById ~ test:", data)
      return
    } catch (error) {
      throw error
    }
  }

  async updateEventTaskRequiredVolunteersById(eventId: number, taskId: number, eventTaskData: Pick<EventTask, "nbVolunteersRequired">): Promise<EventTask[]> {
    try {
      const data = await AppDataSource
      .createQueryBuilder()
      .update(EventTask)
      .set(eventTaskData)
      .where("eventId = :eventId", { eventId })
      .andWhere("taskId = :taskId", { taskId })
      .execute();
      console.log("🚀 ~ EventTaskService ~ updateEventTaskRequiredVolunteersById ~ test:", data)
    return
    } catch (error) {
      throw error
    }
  }

  async deleteEventTaskById(eventId: number, taskId: number): Promise<EventTask[]> {
    try {
      const data = await AppDataSource
      .createQueryBuilder()
      .delete()
      .from(EventTask)
      .where("eventId = :eventId", { eventId })
      .andWhere("taskId = :taskId", { taskId })
      .execute();
      console.log("🚀 ~ EventTaskService ~ updateEventTaskRequiredVolunteersById ~ test:", data)
    return
    } catch (error) {
      throw error
    }
  }
}