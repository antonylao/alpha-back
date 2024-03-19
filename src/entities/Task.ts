import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { EventTask } from "./EventTask";
import { VolunteerTaskPreference } from "./VolunteerTaskPreference";
import { VolunteerAssignment } from "./VolunteerAssignment";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number
  @Column({ type: "varchar", length: 75, unique: true })
  name: string;
  @Column({ type: "varchar", length: 300 })
  description: string;
  @Column({ type: "integer", unsigned: true, default: 1 })
  nbVolunteersDefault: number;

  @OneToMany(() => EventTask, eventTask => eventTask.task)
  eventTasks: EventTask[];
  @OneToMany(() => VolunteerTaskPreference, volunteerTaskPreference => volunteerTaskPreference.task)
  volunteerTaskPreferences: VolunteerTaskPreference[];
  // @OneToMany(() => VolunteerAssignment, volunteerAssignment => volunteerAssignment.task)
  // volunteer_assignments: VolunteerAssignment[];

  @CreateDateColumn()
  createdAt: Date
  @UpdateDateColumn()
  updatedAt: Date
}

