import express from "express";
import { Request, Response } from "express";
import * as dotenv from "dotenv"
import { Routes } from "./routes";
import bodyParser from "body-parser";
import { AppDataSource } from "./data-source";

const app = express()
dotenv.config()
console.log('variable : '+ process.env.DB_PORT)

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")

        app.use(bodyParser.json())
        Routes.forEach(route => {
            (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
                const result = (new (route.controller as any))[route.action](req, res, next)
                if (result instanceof Promise) {
                    result.then(
                        result => result !== null && result !== undefined ? res.send(result) : undefined
                    )
                } else if (result !== null && result !== undefined) {
                    res.json(result)
                }
            })
            // app[route.method](route.route, (req: Request, res: Response, next: Function)=>{
            //     const result = (new route.controller)[route.action](req, res, next)
            //     res.send(result)
            // })
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