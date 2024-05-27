import { AppDataSource } from "../data-source";
import { VolunteerAssignmentQueries } from "../utils/queries";
import { Role, User } from "../entities/User";
import { AppError, ErrorName, HttpCode } from "../utils/AppError";
import { Status, VolunteerAssignment } from "../entities/VolunteerAssignment";
import { FindOneOptions, createQueryBuilder, getRepository } from "typeorm";
import { EventTask } from "../entities/EventTask";
import { Task } from "../entities/Task";
import { isDefaultClause } from "typescript";
import { UserService } from "./UserService";
import { ReqParamIds, ReqParamIdsForCreation } from "../controllers/VolunteerAssignmentController";
import { LessThan, MoreThan } from "typeorm";
import { Event } from "../entities/Event";




export class VolunteerAssignmentService {
  private volunteerAssignmentRepository = AppDataSource.getRepository(VolunteerAssignment)
  private userRepository = AppDataSource.getRepository(User)
  private eventTaskRepository = AppDataSource.getRepository(EventTask);
  private eventRepository = AppDataSource.getRepository(Event);
  private taskRepository = AppDataSource.getRepository(Task);


  private userService = new UserService();
  // private eventTaskService = new EventTaskService();


  // either create an assignment, or update it if it already exists
  async createPendingVolunterAssignment(params: ReqParamIdsForCreation) {
    try {
      //find user en eventTask entities
      const user = await this.userService.getVolunteerById(params.userId)

      //*method entity manager API
      const eventTask = await AppDataSource.getRepository(EventTask)
        .createQueryBuilder("et")
        .where("et.eventId = :eventId", { eventId: params.eventId })
        .andWhere("et.taskId = :taskId", { taskId: params.taskId })
        .getOne()

      if (eventTask === null || eventTask === undefined) {
        throw new AppError(HttpCode.BAD_REQUEST, `Il n'existe pas de donnée dans la table eventTask avec l'association de clés primaires {eventId: ${params.eventId}, taskId: ${params.eventId}}`)
      }

      //if primary keys already exist, return error message
      const existingAssignment = await this.volunteerAssignmentRepository
        .createQueryBuilder("va")
        .where("va.eventTaskEventId = :eventId", { eventId: params.eventId })
        .andWhere("va.eventTaskTaskId = :taskId", { taskId: params.taskId })
        .andWhere("va.userId = :userId", { userId: params.userId })
        .getOne()


      if (existingAssignment !== null && existingAssignment !== undefined) {
        console.log("🚀 ~ VolunteerAssignmentService ~ createPendingVolunterAssignment ~ existingAssignment:", existingAssignment)

        switch (existingAssignment.status) {
          case Status.CANCELED:
          case Status.REFUSED:
            console.log("🚀 ~ VolunteerAssignmentService ~ createPendingVolunterAssignment ~ existingAssignment:", existingAssignment)
            existingAssignment.status = Status.PENDING
            return await this.update(existingAssignment)
            break;
          default:
            const error = new AppError(HttpCode.BAD_REQUEST, `Il existe déjà une donnée dans la table volunteerAssignment avec l'association de clés primaires ${JSON.stringify(params)} dont le status n'est ni refusé, ni annulé`)
            throw error
            break;
        }
        //!change here
        // const error = new AppError(HttpCode.BAD_REQUEST, `Il existe déjà une donnée dans la table volunteerAssignment avec l'association de clés primaires ${JSON.stringify(params)}`)
        // throw error
      }



      //create body
      const body = { user, eventTask, status: Status.PENDING }
      console.log("🚀 ~ VolunteerAssignmentService ~ createPendingVolunterAssignment ~ body:", body)
      const assignment = await this.volunteerAssignmentRepository.create(body)
      await this.volunteerAssignmentRepository.save(assignment)
      return assignment
    } catch (error) {
      throw error
    }
  }

  async getPastEventsInfoForOrganiserVolunteerCard(volunteerId: number) {
    try {
      const validVolunteerId = await this.userService.validVolunteerId(volunteerId)
      if (!validVolunteerId) {
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
            id: true,
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
            startOn: true,
            id: true
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
        status: Status.PENDING,
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

  
  //general function: not used
  async getAllPrimaryFields(params: ReqParamIds) {
    //*rawquery method
    const queryData = await this.volunteerAssignmentRepository.query(
      VolunteerAssignmentQueries.allPrimaryFields, [params.volunteerId, params.eventId, params.taskId]
    )

    return queryData[0];
  }

  async getFinishedAssignmentsInfo(volunteerId: number) {
    try {
      const queryData = await this.volunteerAssignmentRepository.query(
        // VolunteerAssignmentQueries.finishedAssignmentsInfo2, [volunteerId]
        VolunteerAssignmentQueries.finishedAssignmentsInfo, [Status.ACCEPTED.toString(), volunteerId]
      )

      return queryData;
    } catch (error) {
      throw error
    }
  }
  async getAssignmentForUpdate(params: ReqParamIds) {
    try {
      const queryData = await this.volunteerAssignmentRepository.query(
        VolunteerAssignmentQueries.assignmentForCommentUpdate
        , [params.volunteerId, params.eventId, params.taskId]
      )

      return queryData[0];
    } catch (error) {
      throw error
    }
  }


  async getAssociatedEventDateAndDuration(params: ReqParamIds) {
    try {
      // const volunteerAssignment = this.volunteerAssignmentRepository.find({
      //   relations: {
      //     eventTask: {
      //       event: true,
      //       task: true
      //     },
      //   },
      //   where: {
      //     user: { id: params.volunteerId },
      //     // eventTask: {
      //     // event: { id: params.eventId },
      //     // task: { id: params.taskId }
      //     // },
      //   },
      // })

      // return volunteerAssignment

      //*raw query method
      const queryData = await this.volunteerAssignmentRepository.query(
        VolunteerAssignmentQueries.associatedEventDateAndDuration, [params.volunteerId, params.eventId, params.taskId]
      )

      return queryData[0];
    } catch (error) {
      throw error
    }
  }

  async update(assignment: Partial<VolunteerAssignment> & Pick<VolunteerAssignment, "id">) {
    try {
      return await this.volunteerAssignmentRepository.save(assignment)
    } catch (error) {
      throw error
    }

  }
}