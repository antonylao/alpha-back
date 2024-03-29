import { AppDataSource } from "../data-source"
import { EventTask } from "../entities/EventTask";
import { Status } from "../entities/VolunteerAssignment";
import { EventTaskQueries } from "../utils/queries";


export class EventTaskService {

  private eventTaskRepository = AppDataSource.getRepository(EventTask)

  async getUpcomingEventInfosForTaskApply(eventId: number) {
    try {
      //trouver le volunteer_assignment_count_validated
      const queryData = await this.eventTaskRepository.query(
        EventTaskQueries.upcomingEventInfosForTaskApply, [Status.ACCEPTED.toString(), eventId]
      )

      //convert countValidatedAssignment values to integers
      queryData.forEach((data) => {
        if (data.countValidatedAssignment === null) {
          data.countValidatedAssignment = 0
        } else {
          data.countValidatedAssignment = +data.countValidatedAssignment
        }
      })

      return queryData;

    } catch (error) {
      throw error
    }
  }
}