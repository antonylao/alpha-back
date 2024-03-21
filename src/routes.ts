import { UserController } from "./controllers/UserController";
import { VolunteerAssignmentController } from "./controllers/VolunteerAssignmentController";
import { VolunteerAssignment } from "./entities/VolunteerAssignment";

export const Routes = [
    // {
    //     method: "", // get, post, patch, put, delete
    //     route: "", // chemin / url apres localhost => localhost:3000/
    //     controller: , // nom du fichier
    //     action: "" // nom de la fonction dans le fichier
    // },
    {
        method: "get",
        route: "/volunteer",
        controller: UserController,
        action: "readAllVolunteersForOrganiserVolunteerIndex"
    },
    {
        method: "get",
        route: "/volunteer/:volunteerId/past_events",
        controller: VolunteerAssignmentController, // nom du fichier
        action: "readPastEventsInfoForOrganiserVolunteerCard" // nom de la fonction dans le fichier
    },
]
