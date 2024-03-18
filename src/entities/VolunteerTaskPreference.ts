import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { Task } from "./Task";

@Entity()
export class VolunteerTaskPreference {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, (user) => user.volunteerTaskPreferences, { nullable: false })
  user: User;
  @ManyToOne(() => Task, (task) => task.volunteerTaskPreferences, { nullable: false })
  task: Task;

  @CreateDateColumn()
  created_at: Date
  @UpdateDateColumn()
  updated_at: Date
}
