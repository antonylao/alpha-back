import { UserController } from "./controllers/UserController";
import { VolunteerAssignmentController } from "./controllers/VolunteerAssignementController";

export const Routes = [
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

]
