import { UserController } from "./controllers/UserController";

export const Routes = [
    {
        method: "get", // get, post, patch, put, delete
        route: "/user/:user_id", // chemin / url apres localhost => localhost:3000/
        controller: UserController, // nom du fichier
        action: "read" // nom de la fonction dans le fichier
    },
    {
        method: "put", // get, post, patch, put, delete
        route: "/user/:user_id", // chemin / url apres localhost => localhost:3000/
        controller: UserController, // nom du fichier
        action: "update" // nom de la fonction dans le fichier
    },

]
