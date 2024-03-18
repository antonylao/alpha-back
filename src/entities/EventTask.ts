import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Event } from "./Event";
import { Task } from "./Task";

export enum Progression {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  AWAITING_CONFIRMATION = "awaiting_confirmation",
  COMPLETED = "completed"
}

@Entity()
export class EventTask {
  @PrimaryGeneratedColumn()
  id: number
  @Column({ type: "integer" })
  nbVolunteersRequired: number;
  @Column({
    type: "enum",
    enum: Progression,
  })
  progression: Progression; //define with "Progression.<ENUM>"

  @ManyToOne(() => Event, (event) => event.eventTasks, { nullable: false })
  event: Event;
  @ManyToOne(() => Task, (task) => task.eventTasks, { nullable: false })
  task: Task;

  @CreateDateColumn()
  created_at: Date
  @UpdateDateColumn()
  updated_at: Date
}
