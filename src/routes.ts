import { UserController } from "./controllers/UserController";
import { VolunteerAssignment } from "./entities/VolunteerAssignment";
import { VolunteerAssignmentController } from "./controllers/VolunteerAssignmentController";
import { EventController } from '../src/controllers/EventController'
import { EventTaskController } from "./controllers/EventTaskController";

export const Routes = [
    // {
    //     method: "", // get, post, patch, put, delete
    //     route: "", // chemin / url apres localhost => localhost:3000/
    //     controller: , // nom du fichier
    //     action: "" // nom de la fonction dans le fichier
    // },

    //*VOLUNTEER
    { // ** readAllVolunteersForOrganiserVolunteerIndex
        method: "get",
        route: "/volunteer",
        controller: UserController,
        action: "readAllVolunteersForOrganiserVolunteerIndex"
    },
    { // ** readVolunteer
        method: "get", // get, post, patch, put, delete
        route: "/volunteer/:volunteer_id", // chemin / url apres localhost => localhost:3000/
        controller: UserController, // nom du fichier
        action: "readVolunteer" // nom de la fonction dans le fichier
    },
    { // ** updateVolunteer
        method: "put", // get, post, patch, put, delete
        route: "/volunteer/:volunteer_id", // chemin / url apres localhost => localhost:3000/
        controller: UserController, // nom du fichier
        action: "updateVolunteer" // nom de la fonction dans le fichier
    },
    { // ** readVolunteerPassword
        method: "get", // get, post, patch, put, delete
        route: "/volunteer/:volunteer_id/change_password", // chemin / url apres localhost => localhost:3000/
        controller: UserController, // nom du fichier
        action: "readVolunteerPassword" // nom de la fonction dans le fichier
    },
    { // ** updateVolunteerPassword
        method: "put", // get, post, patch, put, delete
        route: "/volunteer/:volunteer_id/change_password", // chemin / url apres localhost => localhost:3000/
        controller: UserController, // nom du fichier
        action: "updateVolunteerPassword" // nom de la fonction dans le fichier
    },

    //*VOLUNTEER ASSIGNMENTS
    {
        method: "get",
        route: "/volunteer/:volunteerId/past_events",
        controller: VolunteerAssignmentController, // nom du fichier
        action: "readPastEventsInfoForOrganiserVolunteerCard" // nom de la fonction dans le fichier
    },
    { // ** readAllComments
        method: "get", // get, post, patch, put, delete
        route: "/organiser/comments", // chemin / url apres localhost => localhost:3000/
        controller: VolunteerAssignmentController, // nom du fichier
        action: "readAllComments" // nom de la fonction dans le fichier
    },
    { // ** readAllPendingRequests
        method: "get", // get, post, patch, put, delete
        route: "/organiser/pending_requests", // chemin / url apres localhost => localhost:3000/
        controller: VolunteerAssignmentController, // nom du fichier
        action: "readAllPendingRequests" // nom de la fonction dans le fichier
    },


    //*ORGANISER
    { // ** readOrganiser
        method: "get", // get, post, patch, put, delete
        route: "/organiser/:organiser_id", // chemin / url apres localhost => localhost:3000/
        controller: UserController, // nom du fichier
        action: "readOrganiser" // nom de la fonction dans le fichier
    },
    { // ** updateOrganiser
        method: "put", // get, post, patch, put, delete
        route: "/organiser/:organiser_id", // chemin / url apres localhost => localhost:3000/
        controller: UserController, // nom du fichier
        action: "updateOrganiser" // nom de la fonction dans le fichier
    },
    { // ** readOrganiserPassword
        method: "get", // get, post, patch, put, delete
        route: "/organiser/:organiser_id/change_password", // chemin / url apres localhost => localhost:3000/
        controller: UserController, // nom du fichier
        action: "readOrganiserPassword" // nom de la fonction dans le fichier
    },
    { // ** updateOrganiserPassword
        method: "put", // get, post, patch, put, delete
        route: "/organiser/:organiser_id/change_password", // chemin / url apres localhost => localhost:3000/
        controller: UserController, // nom du fichier
        action: "updateOrganiserPassword" // nom de la fonction dans le fichier
    },

    //* EVENT
    { // ** getAllEvents
        method: "get",
        route: "/event",
        controller: EventController,
        action: "getAllEvents"
    },
    { // ** getEventById
        method: "get",
        route: "/event/:id",
        controller: EventController,
        action: "getEventById"
    },
    { // ** readCommentsByEventId
        method: "get",
        route: "/event/:event_id/comments",
        controller: EventController,
        action: "readCommentsByEventId"
    },
    { // ** readRatingsByEventId
        method: "get",
        route: "/event/:event_id/ratings",
        controller: EventController,
        action: "readRatingsByEventId"
    },
    { // ** createEvent
        method: "post",
        route: "/event",
        controller: EventController,
        action: "createEvent"
    },
    { // ** updateEvent
        method: "put",
        route: "/event",
        controller: EventController,
        action: "updateEvent"
    },
    { // ** deleteEvent
        method: "delete",
        route: "/event",
        controller: EventController,
        action: "deleteEvent"
    },
    { // ** updateRatingsByEventId
        method: "put",
        route: "/event/:event_id/task/:task_id/user/:user_id/rating",
        controller: EventController,
        action: "updateRatingsByEventId"
    },
    { // ** updateStatusByEventId
        method: "put",
        route: "/event/:event_id/task/:task_id/user/:user_id/volunteer_assignment",
        controller: EventController,
        action: "updateStatusByEventId"
    },

// ** EventTask

    { // ** readEventTaskById
        method: "get",
        route: "/event/:event_id/task/:task_id",
        controller: EventTaskController,
        action: "readEventTaskById"
    },
    { // ** updateEventTaskProgressionById
        method: "put",
        route: "/event/:event_id/task/:task_id/progression",
        controller: EventTaskController,
        action: "updateEventTaskProgressionById"
    },
    { // ** updateEventTaskRequiredVolunteersById
        method: "put",
        route: "/event/:event_id/task/:task_id/required_volunteers",
        controller: EventTaskController,
        action: "updateEventTaskRequiredVolunteersById"
    },
    { // ** updateEventTaskRequiredVolunteersById
        method: "delete",
        route: "/event/:event_id/task/:task_id",
        controller: EventTaskController,
        action: "deleteEventTaskById"
    },
]
