import express, { NextFunction } from "express";
import { Request, Response } from "express";
import * as dotenv from "dotenv"
import { Routes } from "./routes";
import bodyParser from "body-parser";
import { AppDataSource } from "./data-source";
import { AppError } from "./utils/AppError";
import { jwtCheck } from "./middlewares/jwtCheck";
import { jwtCheckRefresh } from "./middlewares/jwtCheckRefresh";
import { organiserCheck, volunteerCheck } from "./middlewares/userCheck";
import cors from "cors";

dotenv.config()

const app = express()
app.use(cors());

console.log('variable : ' + process.env.DB_PORT)

app.use("/auth/refreshToken", jwtCheckRefresh)
app.use("/api", jwtCheck)
app.use("/api/organiserCheck", organiserCheck)
app.use("/api/volunteerCheck", volunteerCheck)

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")

        app.use(bodyParser.json())
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

            app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
                if (res.headersSent) {
                    return next(err)
                }
                if (err instanceof AppError) {
                    res.status(err.httpCode).send(err)
                    return
                }
                const message = err.message ? err.message : err
                res.status(500).send({ message })
            })
        })
    }).catch((err) => {
        console.error("Error during Data Source initialization", err)
    })

// app.get("/test", (req: Request, res: Response, next: Function)=>{
//     console.log("coucou");
//     res.send("coucou tout le monde")
// })


app.listen(process.env.PORT)
console.log("express running on port :", process.env.PORT)