import { Connection, EntityManager, FindManyOptions, FindOneOptions, FindOptions, FindOptionsWhere, Like, Repository } from "typeorm";
import { Event, EventType } from "../entities/Event";
import { AppDataSource } from "../data-source";


export class EventService {
 

  
  private eventRepository = AppDataSource.getRepository(Event);

  async getAllEvents(): Promise<Event[]> {
    return await this.eventRepository.find();
  }

  async getEventById(id: number): Promise<Event | undefined> {
    const byId :FindOneOptions<Event> = {where:{id}, relations: {eventTasks: true} };
    return await this.eventRepository.findOne(byId);
  }
  
  async getEventByTitle(title: string): Promise<Event[] | undefined> {
    
    return await this.eventRepository.find({ where: { title:title } });
  }

  async getEventByType(type: number): Promise<Event [] | undefined> {
   
    return await this.eventRepository.find( { where: { type: type } });
   
  }

  // recherche par date, utilisation ultérieure

  // async getEventsByDate(date: Date): Promise<Event[]  | undefined> {
  //  console.log("recherche: "+ date);
  //   return await this.eventRepository.find({ where: { startOn: date } });
  // }



  async createEvent(eventData: Partial<Event>): Promise<Event> {
    const newEvent = this.eventRepository.create(eventData);
    return await this.eventRepository.save(newEvent);
  }

  // async updateEvent(id: number, eventData: Partial<Event>): Promise<Event | undefined> {
  //   const event = await this.getEventById(id);
  //   if (event) {
  //     await this.eventRepository.update(id, eventData);
  //     return await this.getEventById(id);
  //   }
  //   return undefined;
  // }

  async updateEvent(id: number, eventData: Partial<Event>): Promise<Event | undefined> {
    console.log("ID de l'événement à mettre à jour dans le service : ", id);
    console.log("Données reçues dans le service : ", eventData);
    const event = await this.getEventById(id);
    if (event) {
      console.log("Evénement trouvé dans la base de données : ", event);
        Object.assign(event, eventData);
        
        console.log("Evénement mis à jour : ", event);
        await this.eventRepository.save(event);
        console.log("ok dans la bdd");
        console.log(eventData);
        return event;
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


