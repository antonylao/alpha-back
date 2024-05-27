import { AppDataSource } from "../data-source";
import { Role, User } from "../entities/User";
import { AppError, HttpCode } from "../utils/AppError";

export class UserService {
   private userRepository = AppDataSource.getRepository(User)
  

  async create(user: Partial<User>) {
    const newUser = this.userRepository.create(user)
    await this.userRepository.save(newUser)
    return newUser
  }

  async validVolunteerId(id: number): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id: id, role: Role.VOLUNTEER },
      select: { id: true }
    });

    if (user === null) {
      return false;
    }

    return true;
  }

  async validOrganiserId(id: number): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id: id, role: Role.ADMIN },
      select: { id: true }
    });

    if (user === null) {
      return false;
    }

    return true;
  }

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
          password: true,
          token: true,
          refreshToken: true
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

  async getByEmail(email: string, role: Role) {
    try {
      return await this.userRepository.findOne({ where: { email, role } });
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
    return await this.userRepository.findOne({ where: { id } });
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