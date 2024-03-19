import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { Event } from "./Event";
import { Task } from "./Task";

export enum Progression {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  AWAITING_CONFIRMATION = "awaiting_confirmation",
  COMPLETED = "completed"
}

@Entity()
@Unique(["task", "event"])
export class EventTask {
  @PrimaryGeneratedColumn()
  id: number
  @Column({ type: "integer", unsigned: true })
  nbVolunteersRequired: number;
  @Column({
    type: "enum",
    enum: Progression,
    default: Progression.NOT_STARTED
  })
  progression: Progression; //define with "Progression.<ENUM>"

  @ManyToOne(() => Event, (event) => event.eventTasks, { nullable: false, onDelete: 'CASCADE' })
  event: Event;
  @ManyToOne(() => Task, (task) => task.eventTasks, { nullable: false, onDelete: 'CASCADE' })
  task: Task;

  @CreateDateColumn()
  created_at: Date
  @UpdateDateColumn()
  updated_at: Date
}
