import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { VolunteerTaskPreference } from "./VolunteerTaskPreference";
import { VolunteerAssignment } from "./VolunteerAssignment";


export enum Role {
  ADMIN = "admin",
  VOLUNTEER = "volunteer"
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number
  @Column({
    type: "enum",
    enum: Role,
  })
  role: Role; //define with "Role.<ENUM>"
  @Column({ type: "varchar", length: 75 })
  firstname: string;
  @Column({ type: "varchar", length: 75 })
  lastname: string;
  @Column({ type: "varchar", length: 300, unique: true })
  email: string;
  @Column({ type: "varchar", length: 300 })
  password: string;  //password hashé
  @Column({ type: "varchar", length: 300, nullable: true })
  profilePicture: string; //chemin url
  @Column({ type: "boolean", default: false })
  warning: boolean;
  @Column({ type: "boolean", default: false })
  ban: boolean;

  @OneToMany(() => VolunteerTaskPreference, volunteerTaskPreference => volunteerTaskPreference.user)
  volunteerTaskPreferences: VolunteerTaskPreference[];
  @OneToMany(() => VolunteerAssignment, volunteerAssignment => volunteerAssignment.user)
  volunteerAssignments: VolunteerAssignment[];

  @CreateDateColumn()
  created_at: Date
  @UpdateDateColumn()
  updated_at: Date
}

