import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Room } from "./Room";
import { EventTask } from "./EventTask";
import { VolunteerAssignment } from "./VolunteerAssignment";

export enum EventType {
  CONCERT = 1,
  THEATRE = 2,
  STANDUP = 3
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
  @Column({ type: "varchar", length: 50, nullable: true })
  picture: string; //nom du fichier et extension

  @ManyToOne(() => Room, (room) => room.events, { nullable: false, onDelete: 'CASCADE' })
  room: Room;

  @OneToMany(() => EventTask, eventTask => eventTask.event)
  eventTasks: EventTask[];
  // @OneToMany(() => VolunteerAssignment, volunteerAssignment => volunteerAssignment.event)
  // volunteer_assignments: VolunteerAssignment[];

  @CreateDateColumn()
  createdAt: Date
  @UpdateDateColumn()
  updatedAt: Date
}

