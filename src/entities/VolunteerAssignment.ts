import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, Unique, UpdateDateColumn } from "typeorm";
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
@Unique(["task", "event"])
@Unique(["task", "event", "user"])
export class VolunteerAssignment {
  @PrimaryGeneratedColumn()
  id: number
  @Column({
    type: "enum",
    enum: Status,
    default: Status.PENDING
  })
  status: Status; //define with "Status.<ENUM>"

  @Column({ type: "varchar", length: 300, nullable: true })
  volunteerComment: string;
  @Column({ type: "tinyint", unsigned: true, nullable: true }) //min: 1, max: 5: dans l'app
  organiserRating: number;

  @ManyToOne(() => User, (user) => user.volunteerAssignments, { nullable: false, onDelete: 'CASCADE' })
  user: User;
  @ManyToOne(() => Task, (task) => task.volunteerAssignments, { nullable: false, onDelete: 'CASCADE' })
  task: Task;
  @ManyToOne(() => Event, (event) => event.volunteerAssignments, { nullable: false, onDelete: 'CASCADE' })
  event: Event;

  @CreateDateColumn()
  created_at: Date
  @UpdateDateColumn()
  updated_at: Date
}