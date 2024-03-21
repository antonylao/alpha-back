import {EventController} from '../src/controllers/EventController'

export const Routes = [
    // {
    //     method: "", // get, post, patch, put, delete
    //     route: "", // chemin / url apres localhost => localhost:3000/
    //     controller: , // nom du fichier
    //     action: "" // nom de la fonction dans le fichier
    // },
    {
        method: "get",
        route: "/event",
        controller: EventController,
        action: "getAllEvents"
    },
]
