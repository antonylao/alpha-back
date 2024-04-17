import { AppDataSource } from "../data-source";
import { VolunteerAssignmentQueries } from "../utils/queries";
import { Role, User } from "../entities/User";
import { AppError, HttpCode } from "../utils/AppError";
import { Status, VolunteerAssignment } from "../entities/VolunteerAssignment";
import { UserService } from "./UserService";
import { ReqParamIds, ReqParamIdsForCreation } from "../controllers/VolunteerAssignmentController";
import { LessThan, MoreThan } from "typeorm";
import { Event } from "../entities/Event";
import { Task } from "../entities/Task";
import { EventTask } from "../entities/EventTask";

export class VolunteerAssignmentService {
  private volunteerAssignmentRepository = AppDataSource.getRepository(VolunteerAssignment)
  private userService = new UserService();
  // private eventTaskService = new EventTaskService();

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
        throw new AppError(HttpCode.BAD_REQUEST, `Il existe déjà une donnée dans la table volunteerAssignment avec l'association de clés primaires ${JSON.stringify(params)}`)
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
    console.log("🚀 ~ VolunteerAssignmentService ~ getAllPendingRequests ~ pendingRequest:", pendingRequest)
    return pendingRequest
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