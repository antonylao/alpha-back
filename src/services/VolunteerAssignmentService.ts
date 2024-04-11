import { AppDataSource } from "../data-source";
import { VolunteerAssignmentQueries } from "../utils/queries";
import { Role, User } from "../entities/User";
import { AppError, HttpCode } from "../utils/AppError";
import { Status, VolunteerAssignment } from "../entities/VolunteerAssignment";
import { FindOneOptions, createQueryBuilder, getRepository } from "typeorm";
import { EventTask } from "../entities/EventTask";
import { Task } from "../entities/Task";
import { isDefaultClause } from "typescript";

export class VolunteerAssignmentService {
  private volunteerAssignmentRepository = AppDataSource.getRepository(VolunteerAssignment)
  private userRepository = AppDataSource.getRepository(User)
  private eventTaskRepository = AppDataSource.getRepository(EventTask);
  private eventRepository = AppDataSource.getRepository(Event);
  private taskRepository = AppDataSource.getRepository(Task);

  async getPastEventsInfoForOrganiserVolunteerCard(volunteerId: number) {
    try {

      //vérif que le voluntterId existe
      //!changer par la fonction dans UserService getVolunteerById()
      const user = await this.userRepository.findOne({ where: { id: volunteerId, role: Role.VOLUNTEER } });
      if (user === null) {
        throw new AppError(HttpCode.NOT_FOUND, `Pas de bénévole à l'id ${volunteerId}`)
      }

      const queryData = await this.volunteerAssignmentRepository.query(
        VolunteerAssignmentQueries.pastEventsInfoForOrganiserVolunteerCard, [volunteerId]
      )

      return queryData;

    } catch (error) {
      throw error
    }
  }

  async getAllComments(): Promise<VolunteerAssignment[]> {
    const comments = this.volunteerAssignmentRepository.find({
      relations: {
        eventTask: {
          event: {
            room: true
          },
          task: true,
        },
        user: true,
      },
      select: {
        id: true,
        volunteerComment: true,
        eventTask: {
          event: {
            room: {
              name: true
            },
            title: true,
            type: true,
            startOn: true
          },
          task: {
            name: true,
          },
        },
        user: {
          firstname: true,
          lastname: true
        }
      }
    })
    return comments
  }

  async getAllPendingRequests(): Promise<VolunteerAssignment[]> {
    const pendingRequest = this.volunteerAssignmentRepository.find({
      relations: {
        eventTask: {
          event: {
            room: true
          },
          task: true,
        },
        user: true,
      },
      select: {
        id: true,
        status: true,
        eventTask: {
          event: {
            room: {
              name: true
            },
            title: true,
            type: true,
            startOn: true
          },
          task: {
            name: true,
          },
        },
        user: {
          firstname: true,
          lastname: true
        }
      },
      where: {
        status: Status.PENDING
      },
    })
    
    return pendingRequest
  }

  //getAll volunteerAssigment

  async getAllVolunteerAssignments(): Promise<VolunteerAssignment[]> {
    return await this.volunteerAssignmentRepository.find({
      relations: {
        eventTask: {
          event: {
            room: true
          },
          task: true,
        },
        user: true,
      },
      select: {
        id: true,
        volunteerComment: true,
        eventTask: {
          event: {
            room: {
              name: true
            },
            title: true,
            type: true,
            startOn: true
          },
          task: {
            name: true,
          },
        },
        user: {
          firstname: true,
          lastname: true
        }
      }
    });
  }

  // créer un assignment volontaire 
  async createVolunteerAssignment(userId: number, eventId: number, taskId: number): Promise<VolunteerAssignment> {
    const createAssignment = await this.volunteerAssignmentRepository
        .createQueryBuilder("va")
        .where("va.eventTaskEventId = :eventId", { eventId:eventId })
        .andWhere("va.status = :status", { status: Status.ACCEPTED })
        .andWhere("va.userId = :userId", { userId: userId })
        .getOne()
   console.log(createAssignment)
         return createAssignment;
        //  si le user a deja une tache accepté je veux que cela me retourne une erreur avec un message : volontaire a deja un job dans cet event
        //  dans l'autre cas, la création est bien effectué et je veux un message : job assigné au volontaire
  
  

    // // Vérifier si l'utilisateur a déjà une tâche dans le même événement
    // const existingAssignment = await this.volunteerAssignmentRepository.findOne({
    //   where: { id:userId && eventTaskId }
    // });
    // if (existingAssignment) {
    //   throw new Error("L'utilisateur a déjà une tâche dans le même événement");
    // }

    // const newVolunteerAssignment = this.volunteerAssignmentRepository.create({
    //   user,
    //   eventTask,
    //   status: Status.ACCEPTED // Par défaut, la nouvelle affectation est ACCEPTED
    // });

    // return await this.volunteerAssignmentRepository.save(newVolunteerAssignment);
  }
}