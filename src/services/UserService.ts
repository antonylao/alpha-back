import { Not } from "typeorm";
import { AppDataSource } from "../data-source";
import { Role, User } from "../entities/User";
import { VolunteerAssignment } from "../entities/VolunteerAssignment";
import { AppError, HttpCode } from "../utils/AppError";

export class UserService {
  private userRepository = AppDataSource.getRepository(User)

  async getVolunteerById(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id: id, role: Role.VOLUNTEER } });

      if (user === null) {
        throw new AppError(HttpCode.NOT_FOUND, `Pas de bénévole à l'id ${id}`)
      }
      return user
    } catch (error) {
      throw error
    }
  }
  async getOrganiserById(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: id,
          role: Role.ADMIN
        },
        select: {
          id: true,
          email: true,
          password: true
        }
      });

      if (user === null) {
        throw new AppError(HttpCode.NOT_FOUND, `Pas d'organisateur à l'id ${id}`)
      }

      return user
    } catch (error) {
      throw error
    }
  }

  async getAllVolunteers() {
    try {
      const volunteers = await this.userRepository.find({
        where: {
          role: Role.VOLUNTEER,
        },
        select:
        {
          id: true,
          firstname: true,
          lastname: true,
          email: true,
          phone: true,
          profilePicture: true,
          warning: true,
          ban: true,
        },
      })

      return volunteers
    } catch (error) {
      throw error
    }
  }


  async update(id: number, user: Partial<User>): Promise<User> {
    await this.userRepository.update(id, user);
    console.log("🚀 ~ UserService ~ update ~ user:", user)
    return this.userRepository.findOne({ where: { id } });
  }

  async getVolunteerChangePassword(id: number): Promise<User> {
    const userId = await this.userRepository.findOne({
      where: {
        id,
        role: Role.VOLUNTEER
      },
      select: {
        id: true,
        password: true
      }
    });
    console.log("🚀 ~ UserService ~ getById ~ userId:", userId)
    return userId
  }

  async getOrganiserChangePassword(id: number): Promise<User> {
    const userId = await this.userRepository.findOne({
      where: {
        id,
        role: Role.ADMIN
      },
      select: {
        id: true,
        password: true
      }
    });
    console.log("🚀 ~ UserService ~ getById ~ userId:", userId)
    return userId
  }

  async updatePassword(id: number, user: Pick<User, "password">): Promise<User> {
    await this.userRepository.update(id, user);
    console.log("🚀 ~ UserService ~ update ~ user:", user)
    return this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        password: true
      }
    });
  }
}