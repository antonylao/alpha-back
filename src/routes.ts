import { UserController } from "./controllers/UserController";
import { VolunteerAssignment } from "./entities/VolunteerAssignment";
import { VolunteerAssignmentController } from "./controllers/VolunteerAssignmentController";
import { EventController } from '../src/controllers/EventController';
import { upload } from './multerConfig';
import { TaskController } from "./controllers/TaskController";
import { EventTaskController } from "./controllers/EventTaskController";
import { RoomController } from "./controllers/RoomController";





export const Routes = [
    // {
    //     method: "", // get, post, patch, put, delete
    //     route: "", // chemin / url apres localhost => localhost:3000/
    //     controller: , // nom du fichier
    //     action: "" // nom de la fonction dans le fichier
    // },

    //*VOLUNTEER
    {
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
    {
        method: "get",
        route: "/event",
        controller: EventController,
        action: "getAllEvents"
    },
    
    {
        method: "get",
        route: "/event/title/:title",
        controller: EventController,
        action: "getEventByTitle"
    },
    {
        method: "get",
        route: "/event/type/:type",
        controller: EventController,
        action: "getEventByType"
    },
    {
        method: "get",
        route: "/event/:id",
        controller: EventController,
        action: "getEventById"
    },

    {
        method: "post",
        route: "/event",
        controller: EventController,
        action: "createEvent"
    },
    {
        method: "put",
        route: "/event/:id",
        controller: EventController,
        action: "updateEvent"
    },
    {
        method: "delete",
        route: "/event/:id",
        controller: EventController,
        action: "deleteEvent"
    },
    // utilisation ultérieure
    // {
    //     method: "get",
    //     route: "/event/date/:date",
    //     controller: EventController,
    //     action: "getEventsByDate"
    // },

    // getAll volunteerAssingment : 
    {
        method: "get",
        route: "/volunteerAssignment",
        controller: VolunteerAssignmentController,
        action : "getAllVolunteerAssignments"
    },

    {
        method: "post",
        route:"/createAssignment",
        controller: VolunteerAssignmentController,
        action :"createAssignment"

    },
    // afficher les tasks

    {
        method: "get",
        route: "/task",
        controller: TaskController,
        action : "getAllTasks"
    },

    //  créer un event task

    {
        method:"post",
        route: "/event_task",
        controller : EventTaskController,
        action : "createEventTask"
    },

    // afficher toute les rooms

    {
        method: "get",
        route: "/room",
        controller: RoomController,
        action : "getAllRooms"
    },

    {

        method: "get",
        route: "/room/:id",
        controller: RoomController,
        action : "getRoomById"
    }

]
