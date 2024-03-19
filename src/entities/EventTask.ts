import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { Event } from "./Event";
import { Task } from "./Task";
import { VolunteerAssignment } from "./VolunteerAssignment";

export enum Progression {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  AWAITING_CONFIRMATION = "awaiting_confirmation",
  COMPLETED = "completed"
}

@Entity()
//la ligne en dessous ne sert à rien, mais je le garde pour la clarté
@Unique(["task", "event"])
export class EventTask {
  @Column({ type: "integer", unsigned: true })
  nbVolunteersRequired: number;
  @Column({
    type: "enum",
    enum: Progression,
    default: Progression.NOT_STARTED
  })
  progression: Progression; //define with "Progression.<ENUM>"



  @PrimaryColumn({ type: "integer", name: "eventId" })
  @ManyToOne(() => Event, (event) => event.eventTasks, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: "eventId" })
  event: Event;
  @PrimaryColumn({ type: "integer", name: "taskId" })
  @ManyToOne(() => Task, (task) => task.eventTasks, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: "taskId" })
  task: Task;

  @OneToMany(() => VolunteerAssignment, (volunteerAssignment) => volunteerAssignment.eventTask)
  volunteerAssignments: VolunteerAssignment[];

  @CreateDateColumn()
  createdAt: Date
  @UpdateDateColumn()
  updatedAt: Date
}

