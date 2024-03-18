import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Room } from "./Room";
import { EventTask } from "./EventTask";
import { VolunteerAssignment } from "./VolunteerAssignement";

export enum EventType {
  CONCERT = "concert",
  THEATRE = "theatre",
  STANDUP = "standup"
}

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number
  @Column({
    type: "enum",
    enum: EventType,
  })
  type: EventType; //define with "EventType.<ENUM>"
  @Column({ type: "varchar", length: 75 })
  title: string;
  @Column({ type: "varchar", length: 300 })
  description: string;
  @Column({ type: "datetime" })
  startOn: Date;
  @Column({ type: "time" })
  duration: string; //? pas sûr
  @Column({ type: "varchar", length: 300 })
  picture: string; //path

  @ManyToOne(() => Room, (room) => room.events, { nullable: false })
  room: Room;

  @OneToMany(() => EventTask, eventTask => eventTask.event)
  eventTasks: EventTask[];
  @OneToMany(() => VolunteerAssignment, volunteerAssignment => volunteerAssignment.event)
  volunteerAssignments: VolunteerAssignment[];

  @CreateDateColumn()
  created_at: Date
  @UpdateDateColumn()
  updated_at: Date
}

