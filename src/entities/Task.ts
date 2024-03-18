import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { EventTask } from "./EventTask";
import { VolunteerTaskPreference } from "./VolunteerTaskPreference";
import { VolunteerAssignment } from "./VolunteerAssignement";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number
  @Column({ type: "varchar", length: 75 })
  name: string;
  @Column({ type: "varchar", length: 300 })
  description: string;
  @Column({ type: "integer", default: 1 })
  nbVolunteersDefault: number;

  @OneToMany(() => EventTask, eventTask => eventTask.task)
  eventTasks: EventTask[];
  @OneToMany(() => VolunteerTaskPreference, volunteerTaskPreference => volunteerTaskPreference.task)
  volunteerTaskPreferences: VolunteerTaskPreference[];
  @OneToMany(() => VolunteerAssignment, volunteerAssignment => volunteerAssignment.task)
  volunteerAssignments: VolunteerAssignment[];

  @CreateDateColumn()
  created_at: Date
  @UpdateDateColumn()
  updated_at: Date
}

