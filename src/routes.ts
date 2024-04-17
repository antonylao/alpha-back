import { UserController } from "./controllers/UserController";
import { VolunteerAssignment } from "./entities/VolunteerAssignment";
import { VolunteerAssignmentController } from "./controllers/VolunteerAssignmentController";
import { EventController } from '../src/controllers/EventController'
import { EventTaskController } from "./controllers/EventTaskController";
import { AuthController } from "./controllers/AuthController";

export const Routes = [
    // {
    //     method: "", // get, post, patch, put, delete
    //     route: "", // chemin / url apres localhost => localhost:3000/
    //     controller: , // nom du fichier
    //     action: "" // nom de la fonction dans le fichier
    // },

    //*AUTH
    {
        method: "post",
        route: "/auth/signup/volunteer",
        controller: AuthController,
        action: "registerVolunteer"
    },
    {
        method: "post",
        route: "/auth/signin/volunteer",
        controller: AuthController,
        action: "loginVolunteer"
    },
    {    //PAS ACCESSIBLE EN PROD
        method: "post",
        route: "/auth/signup/organiser",
        controller: AuthController,
        action: "registerOrganiser"
    },
    {
        method: "post",
        route: "/auth/signin/organiser",
        controller: AuthController,
        action: "loginOrganiser"
    },
    {
        method: "post",
        route: "/auth/refreshToken",
        controller: AuthController,
        action: "refreshToken"
    },
    {
        method: "patch",
        route: "/api/auth/signout",
        controller: AuthController,
        action: "signout"
    },
    { //en vrai c'est un patch
        method: "get",
        route: "/auth/signin/:userId/emailConfirmation",
        controller: AuthController,
        action: "emailConfirmation"
    },

    //*VOLUNTEER
    {
        method: "get",
        route: "/api/organiserCheck/volunteer",
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
    {
        method: "patch",
        route: "/volunteer/:volunteerId/warning",
        controller: UserController,
        action: "applyWarning"
    },
    {
        method: "patch",
        route: "/volunteer/:volunteerId/ban",
        controller: UserController,
        action: "applyBan"
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
    {
        method: "patch",
        route: "/api/volunteer/:volunteerId/past_events/:eventId/task/:taskId/rating",
        controller: VolunteerAssignmentController,
        action: "updateRating"
    },
    {
        method: "get",
        route: "/volunteer/:volunteerId/my_events",
        controller: VolunteerAssignmentController,
        action: "getFinishedAssignmentsInfo"
    },
    {
        method: "patch",
        route: "/api/event/:eventId/task/:taskId/comment",
        controller: VolunteerAssignmentController,
        action: "updateComment"
    },

    {
        method: "post",
        route: "/api/event/:eventId/task/:taskId",
        controller: VolunteerAssignmentController,
        action: "createPendingVolunterAssignment"
    },

    {
        method: "patch",
        route: "/api/event/:eventId/task/:taskId/cancel",
        controller: VolunteerAssignmentController,
        action: "cancelAssignment"
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
    //get upcoming events for the volunteer app
    {
        method: "get",
        route: "/api/event/upcoming",
        controller: EventController,
        action: "getAllUpcomingEvents"
    },


    //*EVENT_TASK
    {
        method: "get",
        route: "/event/upcoming/:eventId/task",
        controller: EventTaskController,
        action: "getUpcomingEventInfosForTaskApply"
    },
]
