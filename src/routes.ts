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
    { // ** refreshToken
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
    { // ** registerVolunteer
        method: "post",
        route: "/auth/signup/volunteer",
        controller: AuthController,
        action: "registerVolunteer"
    },
    { // ** loginVolunteer
        method: "post",
        route: "/auth/signin/volunteer",
        controller: AuthController,
        action: "loginVolunteer"
    },

    //*VOLUNTEER
    { // ** readAllVolunteersForOrganiserVolunteerIndex
        method: "get",
        route: "/api/organiserCheck/volunteer",
        controller: UserController,
        action: "readAllVolunteersForOrganiserVolunteerIndex"
    },
    { // ** readVolunteer
        method: "get", // get, post, patch, put, delete
        route: "/api/volunteer_profile", // chemin / url apres localhost => localhost:3000/
        controller: UserController, // nom du fichier
        action: "readVolunteer" // nom de la fonction dans le fichier
    },
    { // ** updateVolunteer
        method: "put", // get, post, patch, put, delete
        route: "/api/volunteer_profile", // chemin / url apres localhost => localhost:3000/
        controller: UserController, // nom du fichier
        action: "updateVolunteer" // nom de la fonction dans le fichier
    },
    { // ** readVolunteerPassword
        method: "get", // get, post, patch, put, delete
        route: "/api/volunteer/change_password", // chemin / url apres localhost => localhost:3000/
        controller: UserController, // nom du fichier
        action: "readVolunteerPassword" // nom de la fonction dans le fichier
    },
    { // ** updateVolunteerPassword
        method: "put", // get, post, patch, put, delete
        route: "/api/volunteer/change_password", // chemin / url apres localhost => localhost:3000/
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
        route: "/api/volunteer/:volunteerId/past_events",
        controller: VolunteerAssignmentController, // nom du fichier
        action: "readPastEventsInfoForOrganiserVolunteerCard" // nom de la fonction dans le fichier
    },
    { // ** readAllComments
        method: "get", // get, post, patch, put, delete
        route: "/api/organiser/comments", // chemin / url apres localhost => localhost:3000/
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
        route: "/api/organiser", // chemin / url apres localhost => localhost:3000/
        controller: UserController, // nom du fichier
        action: "readOrganiser" // nom de la fonction dans le fichier
    },
    { // ** updateOrganiser
        method: "put", // get, post, patch, put, delete
        route: "/api/organiser", // chemin / url apres localhost => localhost:3000/
        controller: UserController, // nom du fichier
        action: "updateOrganiser" // nom de la fonction dans le fichier
    },
    { // ** readOrganiserPassword
        method: "get", // get, post, patch, put, delete
        route: "/api/organiser/change_password", // chemin / url apres localhost => localhost:3000/
        controller: UserController, // nom du fichier
        action: "readOrganiserPassword" // nom de la fonction dans le fichier
    },
    { // ** updateOrganiserPassword
        method: "put", // get, post, patch, put, delete
        route: "/api/organiser/change_password", // chemin / url apres localhost => localhost:3000/
        controller: UserController, // nom du fichier
        action: "updateOrganiserPassword" // nom de la fonction dans le fichier
    },

    //* EVENT
    { // ** getAllEvents
        method: "get",
        route: "/api/event",
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
    { // ** getEventById
        method: "get",
        route: "/api/event/:id",
        controller: EventController,
        action: "getEventById"
    },
    { // ** createEvent
        method: "post",
        route: "/api/event",
        controller: EventController,
        action: "createEvent"
    },
    { // ** updateEvent
        method: "put",
        route: "/api/event/:event_id",
        controller: EventController,
        action: "updateEvent"
    },
    { // ** deleteEvent
        method: "delete",
        route: "/api/event/:event_id",
        controller: EventController,
        action: "deleteEvent"
    },
    { // ** readCommentsByEventId
        method: "get",
        route: "/api/event/:event_id/comments",
        controller: EventController,
        action: "readCommentsByEventId"
    },
    { // ** readRatingsByEventId
        method: "get",
        route: "/api/event/:event_id/ratings",
        controller: EventController,
        action: "readRatingsByEventId"
    },
    { // ** updateRatingsByEventId
        method: "put",
        route: "/api/event/:event_id/task/:task_id/user/:user_id/rating",
        controller: EventController,
        action: "updateRatingsByEventId"
    },
    { // ** updateStatusByEventId
        method: "put",
        route: "/api/event/:event_id/task/:task_id/user/:user_id/status",
        controller: EventController,
        action: "updateStatusByEventId"
    },

    // ** EventTask

    //*EVENT_TASK
    {
        method: "get",
        route: "/event/upcoming/:eventId/task",
        controller: EventTaskController,
        action: "getUpcomingEventInfosForTaskApply"
    },
    { // ** readEventTaskById
        method: "get",
        route: "/api/event/:event_id/task/:task_id",
        controller: EventTaskController,
        action: "readEventTaskById"
    },
    { // ** updateEventTaskProgressionById
        method: "put",
        route: "/api/event/:event_id/task/:task_id/progression",
        controller: EventTaskController,
        action: "updateEventTaskProgressionById"
    },
    { // ** updateEventTaskRequiredVolunteersById
        method: "put",
        route: "/api/event/:event_id/task/:task_id/required_volunteers",
        controller: EventTaskController,
        action: "updateEventTaskRequiredVolunteersById"
    },
    { // ** deleteEventTaskById
        method: "delete",
        route: "/api/event/:event_id/task/:task_id",
        controller: EventTaskController,
        action: "deleteEventTaskById"
    },
]
