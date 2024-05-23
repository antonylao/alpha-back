import { Connection, EntityManager, FindManyOptions, FindOneOptions, FindOptions, FindOptionsWhere, Like, Repository } from "typeorm";
import { Room } from "../entities/Room";
import { AppDataSource } from "../data-source";

export class RoomService {
 

  
    private roomRepository = AppDataSource.getRepository(Room);
  
    async getAllRooms(): Promise<Room[]> {
      return await this.roomRepository.find();
    }


    async getRoomById(id: number): Promise<Room | undefined> {
      const byId :FindOneOptions<Room> = {where:{id}};
      return await this.roomRepository.findOne(byId);
    }
}