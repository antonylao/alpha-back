import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { Task } from "./Task";

@Entity()
// (userId, taskId) is NOT NULL and UNIQUE => equivalent to PRIMARY KEY
@Unique(["user", "task"])
export class VolunteerTaskPreference {
  //clé primaire: union des clés étrangères?
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, (user) => user.volunteerTaskPreferences, { nullable: false, onDelete: 'CASCADE' })
  user: User;
  @ManyToOne(() => Task, (task) => task.volunteerTaskPreferences, { nullable: false, onDelete: 'CASCADE' })
  task: Task;

  @CreateDateColumn()
  createdAt: Date
}
