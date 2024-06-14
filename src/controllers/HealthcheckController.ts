import { Request, Response, NextFunction } from "express";

export class HealthcheckController {
  healthcheck(req: Request, res: Response, next: NextFunction) {
    try {
      return { "message": "healthcheck ok" }

    } catch (error) {
      next(error)
    }
  }
}