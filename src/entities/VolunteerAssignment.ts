import { Check, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, Unique, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { Event } from "./Event";
import { Task } from "./Task";
import { EventTask } from "./EventTask";

export enum Status {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REFUSED = "refused",
  CANCELED = "canceled"
}

@Entity()
// @Unique(["task", "event"])
@Unique(["eventTask", "user"])
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
  //add columns for each key of the primary key couple in EventTask
  @ManyToOne(() => EventTask, (eventTask) => eventTask.volunteerAssignments, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn([
    { name: "eventTaskEventId", referencedColumnName: "event" },
    { name: "eventTaskTaskId", referencedColumnName: "task" },
  ])
  eventTask: EventTask;
  // @ManyToOne(() => Task, (task) => task.volunteer_assignments, { nullable: false, onDelete: 'CASCADE' })
  // task: Task;
  // @ManyToOne(() => Event, (event) => event.volunteer_assignments, { nullable: false, onDelete: 'CASCADE' })
  // event: Event;

  @CreateDateColumn()
  createdAt: Date
  @UpdateDateColumn()
  updatedAt: Date
}