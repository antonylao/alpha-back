import { Request, Response } from "express";



import { Room } from "../entities/Room";

import { RoomService } from "../services/RoomService";


const roomService = new RoomService();


export class RoomController{

    async getAllRooms(req: Request, res: Response) {
        try {
          const rooms = await roomService.getAllRooms();
          res.json(rooms);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }



}
}