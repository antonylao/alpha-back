import { AppDataSource } from "../data-source";
import { VolunteerAssignmentQueries } from "../utils/queries";
import { Role, User } from "../entities/User";
import { AppError, HttpCode } from "../utils/AppError";
import { Status, VolunteerAssignment } from "../entities/VolunteerAssignment";
import { UserService } from "./UserService";
import { ReqParamIds } from "../controllers/VolunteerAssignmentController";

export class VolunteerAssignmentService {
  private volunteerAssignmentRepository = AppDataSource.getRepository(VolunteerAssignment)
  private userService = new UserService();

  async getPastEventsInfoForOrganiserVolunteerCard(volunteerId: number) {
    try {
      if (!this.userService.validVolunteerId(volunteerId)) {
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
    console.log("🚀 ~ VolunteerAssignmentService ~ getAllPendingRequests ~ pendingRequest:", pendingRequest)
    return pendingRequest
  }


  //general function
  async getAllPrimaryFields(params: ReqParamIds) {
    //*rawquery method
    const queryData = await this.volunteerAssignmentRepository.query(
      VolunteerAssignmentQueries.allPrimaryFields, [params.volunteerId, params.eventId, params.taskId]
    )

    return queryData[0];
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