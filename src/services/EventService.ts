
import { Connection, EntityManager, FindManyOptions, FindOneOptions, FindOptions, FindOptionsWhere, Like, MoreThan, Repository } from "typeorm";
import { Event, EventType } from "../entities/Event";

import { AppDataSource } from "../data-source";
import { AppError, HttpCode } from "../utils/AppError";
import { VolunteerAssignment } from "../entities/VolunteerAssignment";
import { VolunteerAssignmentQueries } from "../utils/queries";
import { Task } from "../entities/Task";
import { User } from "../entities/User";
import { EventTask } from "../entities/EventTask";
import { DateUtils } from "../utils/DateUtils";


export class EventService {
  private volunteerAssignmentRepository = AppDataSource.getRepository(VolunteerAssignment)
  private eventRepository = AppDataSource.getRepository(Event);
  private taskRepository = AppDataSource.getRepository(Task);
  private userRepository = AppDataSource.getRepository(User);

  static eventFinished(obj: { date: Date, duration: string }): boolean {
    return DateUtils.addToDate(obj.date, obj.duration) < new Date()
  }

  async getAllEvents(): Promise<Event[]> {
    return await this.eventRepository.find();
  }

  async getAllUpcomingEvents() {
    try {
      return await this.eventRepository.find({
        relations: {
          room: true
        },
        select: {
          id: true,
          title: true,
          description: true,
          startOn: true,
          duration: true,
          type: true,
          room: {
            name: true
          },
          picture: true
        },
        where: {
          startOn: MoreThan(new Date())
        }
      })
    } catch (error) {
      throw error
    }
  }

  async getEventById(id: number): Promise<Event | undefined> {

    const byId: FindOneOptions<Event> = { where: { id }, relations: { eventTasks: true } };

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



  // async getCommentsByEventId(id: number): Promise<Event[]> {
  //   try {
  //     const event = await this.eventRepository.find({
  //       where: {
  //         id: id,
  //       },
  //       relations: {
  //         eventTasks: {
  //           volunteerAssignments: {
  //             user: true
  //           },
  //           task: true,
  //         }, 

  //       },
  //       select: {
  //         id: true, 
  //         type: true,
  //         title: true,
  //         description: true,
  //         startOn: true,
  //         duration: true,
  //         eventTasks: {
  //           volunteerAssignments: {
  //             id: true,
  //             volunteerComment: true
  //           }
  //         },

  //       }
  //     });

  //     if (event === null) {
  //       throw new AppError(HttpCode.NOT_FOUND, `Pas d'event à l'id ${id}`)
  //     }

  //     return event
  //   } catch (error) {
  //     throw error
  //   }
  // }

  async getCommentsByEventId(id: number): Promise<VolunteerAssignment[]> {
    try {

      //vérif que le voluntterId existe
      //!changer par la fonction dans UserService getVolunteerById()
      const event = await this.eventRepository.findOne({ where: { id: id } });
      if (event === null) {
        throw new AppError(HttpCode.NOT_FOUND, `Pas d'event à l'id ${id}`)
      }

      const queryData = await this.volunteerAssignmentRepository.query(
        VolunteerAssignmentQueries.commentsForEvent, [id]
      )

      return queryData;

    } catch (error) {
      throw error
    }
  }

  // async getRatingsByEventId(id: number): Promise<VolunteerAssignment[]> {
  //  try{
  //   const ratings = await this.volunteerAssignmentRepository.find({
  //     relations: {
  //       eventTask: {
  //         event: {
  //           room: true
  //         },
  //         task: true,
  //       },
  //       user: true,
  //     },
  //     select: {
  //       id: true,
  //       organiserRating: true,
  //       eventTask: {
  //         event: {
  //           room: {
  //             name: true
  //           },
  //           id: true,
  //           title: true,
  //           type: true,
  //           startOn: true
  //         },
  //         task: {
  //           name: true,
  //         },
  //       },
  //       user: {
  //         firstname: true,
  //         lastname: true
  //       }
  //     },
  //     where: {
  //       eventTask: {
  //         event: {
  //           id
  //         }
  //       }
  //     }
  //   })
  //   console.log("🚀 ~ EventService ~ getratingsByEventId ~ ratings:", ratings)
  //   return ratings
  // }
  // catch (error) {
  //   console.log("🚀 ~ EventService ~ getRatingsByEventId ~ error:", error)
  //   throw error
  // }
  // }

  async getRatingsByEventId(id: number): Promise<VolunteerAssignment[]> {
    try {

      //vérif que le voluntterId existe
      //!changer par la fonction dans UserService getVolunteerById()
      const event = await this.eventRepository.findOne({ where: { id: id } });
      if (event === null) {
        throw new AppError(HttpCode.NOT_FOUND, `Pas d'event à l'id ${id}`)
      }

      const queryData = await this.volunteerAssignmentRepository.query(
        VolunteerAssignmentQueries.ratingsForEvent, [id]
      )

      return queryData;

    } catch (error) {
      throw error
    }
  }

  async updateRatingsFromEvent(eventId: number, taskId: number, userId: number, eventData: Pick<VolunteerAssignment, "organiserRating">): Promise<VolunteerAssignment[]> {
    try {

      // ** verif que le voluntterId existe
      //!changer par la fonction dans UserService getVolunteerById()
      const event = await this.eventRepository.findOne({ where: { id: eventId } });
      const task = await this.taskRepository.findOne({ where: { id: taskId } });
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (event === null) {
        throw new AppError(HttpCode.NOT_FOUND, `Pas d'event à l'id ${eventId}`)
      }
      if (task === null) {
        throw new AppError(HttpCode.NOT_FOUND, `Pas de tâche à l'id ${taskId}`)
      }
      if (user === null) {
        throw new AppError(HttpCode.NOT_FOUND, `Pas de bénévole à l'id ${userId}`)
      }

      const queryData = await this.volunteerAssignmentRepository.query(
        VolunteerAssignmentQueries.updateRatingsForEvent, [eventId, taskId, userId]
      )

      await this.volunteerAssignmentRepository.update([eventId, taskId, userId], eventData)
      console.log("🚀 ~ EventService ~ updateRatingsFromEvent ~ queryData:", queryData)
      return queryData;

    } catch (error) {
      throw error
    }
  }

  async updateStatusFromEvent(eventId: number, taskId: number, userId: number, eventData: Pick<VolunteerAssignment, "status">): Promise<VolunteerAssignment[]> {
    try {

      // ** verif que le voluntterId existe
      //!changer par la fonction dans UserService getVolunteerById()
      const event = await this.eventRepository.findOne({ where: { id: eventId } });
      const task = await this.taskRepository.findOne({ where: { id: taskId } });
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (event === null) {
        throw new AppError(HttpCode.NOT_FOUND, `Pas d'event à l'id ${eventId}`)
      }
      if (task === null) {
        throw new AppError(HttpCode.NOT_FOUND, `Pas de tâche à l'id ${taskId}`)
      }
      if (user === null) {
        throw new AppError(HttpCode.NOT_FOUND, `Pas de bénévole à l'id ${userId}`)
      }

      const queryData = await this.volunteerAssignmentRepository.query(
        VolunteerAssignmentQueries.updateStatusForEvent, [eventId, taskId, userId]
      )

      await this.volunteerAssignmentRepository.update([eventId, taskId, userId], eventData)
      console.log("🚀 ~ EventService ~ updateStatusFromEvent ~ queryData:", queryData)
      return queryData;

    } catch (error) {
      throw error
    }
  }

  async createEvent(eventData: Partial<Event>): Promise<Event> {
    console.log('about to create event:', eventData)
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
      console.log("Event deleted successfully")
      return true;
    }
    return false;
  }

 
}


