import { LessThan, Raw } from "typeorm";
import { AppDataSource } from "../data-source";
import { VolunteerAssignment } from "../entities/VolunteerAssignment";
import { DateUtils } from "../utils/DateUtils";
import { VolunteerAssignmentQueries } from "../utils/queries";
import { Role, User } from "../entities/User";
import { AppError, HttpCode } from "../utils/AppError";

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
}