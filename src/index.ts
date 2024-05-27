import express, { NextFunction } from "express";
import { Request, Response } from "express";
import * as dotenv from "dotenv"
import { Routes } from "./routes";
import bodyParser from "body-parser";
import { AppDataSource } from "./data-source";
import { AppError, HttpCode } from "./utils/AppError";
import { jwtCheck } from "./middlewares/jwtCheck";
import { jwtCheckRefresh } from "./middlewares/jwtCheckRefresh";
import { organiserCheck, volunteerCheck } from "./middlewares/userCheck";
import cors from "cors";
//keep it for dev
import { transformRoutesForFront } from "./utils/MetaUtils";
import { errorHandler } from "./middlewares/errorHandler";


dotenv.config()

const app = express()
app.use(cors());

console.log('variable : ' + process.env.DB_PORT)

app.use("/auth/refreshToken", jwtCheckRefresh)
app.use("/api", jwtCheck)
app.use("/api/organiserCheck", organiserCheck)
app.use("/api/volunteerCheck", volunteerCheck)

//to get route obj for front app
console.log(transformRoutesForFront({ beginningSlash: false }))

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")


        app.use('/uploads', express.static('uploads'));
        
        app.use(cors());
        app.use(express.json());
        // https://github.com/mas-iota/nodejs-images-upload-boilerplate/blob/master/app.js
        app.use(express.urlencoded({
            limit:'15MB',
            extended: false,
            
        }));

        //app.use(bodyParser.json({limit:'15MB'}))
        Routes.forEach(route => {
            (app as any)[route.method](route.route, (req: Request, res: Response, next: NextFunction) => {
                console.log("route called: ", route)
                const result = (new (route.controller as any))[route.action](req, res, next)
                if (result instanceof Promise) {
                    result.then(
                        result => result !== null && result !== undefined ?
                            result.status ? res.status(result.status).send(result) : res.send(result) : undefined
                    )
                } else if (result !== null && result !== undefined) {
                    res.json(result)
                }
            })
            // app[route.method](route.route, (req: Request, res: Response, next: Function)=>{
            //     const result = (new route.controller)[route.action](req, res, next)
            //     res.send(result)
            // })

            app.use(errorHandler)
        })
    }).catch((err) => {
        console.error("Error during Data Source initialization", err)
    })


// app.get("/test", (req: Request, res: Response, next: Function)=>{
//     console.log("coucou");
//     res.send("coucou tout le monde")
// })

// app.use(errorHandler)

app.listen(process.env.PORT)
console.log("express running on port :", process.env.PORT)