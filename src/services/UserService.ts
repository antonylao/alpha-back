import { AppDataSource } from "../data-source";
import { Role, User } from "../entities/User";


export class UserService {

    private userRepository = AppDataSource.getRepository(User);

    //** Only return result when role: "volunteer"
    async getVolunteerById(id: number): Promise<User> {
        const userId = await this.userRepository.findOne({ where: { id: id, role: Role.VOLUNTEER } });
        console.log("🚀 ~ UserService ~ getById ~ userId:", userId)
        return userId
    }

    async getOrganiserById(id: number): Promise<User> {
        const userId = await this.userRepository.findOne({ 
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
        console.log("🚀 ~ UserService ~ getById ~ userId:", userId)
        return userId
    }

    async update(id: number, user: Partial<User>): Promise<User> {
        await this.userRepository.update(id, user);
        console.log("🚀 ~ UserService ~ update ~ user:", user)
        return this.userRepository.findOne({ where: { id } });
    }
    
    async getVolunteerChangePassword(id: number): Promise<User>{
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

    async getOrganiserChangePassword(id: number): Promise<User>{
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

