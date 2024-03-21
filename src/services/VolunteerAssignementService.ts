import { AppDataSource } from "../data-source";
import { EventTask } from "../entities/EventTask";
import { User } from "../entities/User";
import { Status, VolunteerAssignment } from "../entities/VolunteerAssignment";



export class VolunteerAssignmentService {

    private volunteerAssignementRepository = AppDataSource.getRepository(VolunteerAssignment);

    async getAllComments(): Promise<VolunteerAssignment[]>{
        const comments =  this.volunteerAssignementRepository.find({
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
        const pendingRequest = this.volunteerAssignementRepository.find({
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

