import { AppDataSource } from "../data-source";
import { VolunteerAssignmentQueries } from "../utils/queries";
import { Role, User } from "../entities/User";
import { AppError, HttpCode } from "../utils/AppError";
import { Status, VolunteerAssignment } from "../entities/VolunteerAssignment";

export class VolunteerAssignmentService {
  private volunteerAssignmentRepository = AppDataSource.getRepository(VolunteerAssignment)
  private userRepository = AppDataSource.getRepository(User)

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
    console.log("🚀 ~ VolunteerAssignmentService ~ getAllPendingRequests ~ pendingRequest:", pendingRequest)
    return pendingRequest
  }
}