import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { Event } from "./Event";
import { Task } from "./Task";

export enum Status {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REFUSED = "refused",
  CANCELED = "canceled"
}

@Entity()
export class VolunteerAssignment {
  @PrimaryGeneratedColumn()
  id: number
  @Column({
    type: "enum",
    enum: Status,
    default: Status.PENDING
  })
  status: Status; //define with "Status.<ENUM>"

  @Column({ type: "varchar", length: 300 })
  volunteerComment: string;
  @Column({ type: "tinyint", unsigned: true, nullable: false }) //min: 1, max: 5: dans l'app
  organiserRating: number;

  @ManyToOne(() => User, (user) => user.volunteerAssignments, { nullable: false })
  user: User;
  @ManyToOne(() => Task, (task) => task.volunteerAssignments, { nullable: false })
  task: Task;
  @ManyToOne(() => Event, (event) => event.volunteerAssignments, { nullable: false })
  event: Event;

  @CreateDateColumn()
  created_at: Date
  @UpdateDateColumn()
  updated_at: Date
}