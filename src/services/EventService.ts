import { Connection, EntityManager, FindOneOptions, Repository } from "typeorm";
import { Event } from "../entities/Event";
import { AppDataSource } from "../data-source";


export class EventService {
 

  
  private eventRepository = AppDataSource.getRepository(Event);

  async getAllEvents(): Promise<Event[]> {
    return await this.eventRepository.find();
  }

  async getEventById(id: number): Promise<Event | undefined> {
    const byId :FindOneOptions<Event> = {where:{id}};
    return await this.eventRepository.findOne(byId);
  }

  async createEvent(eventData: Partial<Event>): Promise<Event> {
    const newEvent = this.eventRepository.create(eventData);
    return await this.eventRepository.save(newEvent);
  }

  async updateEvent(id: number, eventData: Partial<Event>): Promise<Event | undefined> {
    const event = await this.getEventById(id);
    if (event) {
      await this.eventRepository.update(id, eventData);
      return await this.getEventById(id);
    }
    return undefined;
  }

  async deleteEvent(id: number): Promise<boolean> {
    const event = await this.getEventById(id);
    if (event) {
      await this.eventRepository.delete(id);
      return true;
    }
    return false;
  }
}
function InjectRepository(Kennel: any): (target: typeof EventService, propertyKey: undefined, parameterIndex: 0) => void {
  throw new Error("Function not implemented.");
}

