import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Event } from "./Event";

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number
  @Column({ type: "varchar", length: 75 })
  name: string;
  @Column({ type: "integer" })
  capacity: number;
  @Column({ type: "integer" })
  numberRoom: number;

  //pas de clé étrangère
  @OneToMany(() => Event, (event) => event.room)
  events: Event[];

  @CreateDateColumn()
  created_at: Date
  @UpdateDateColumn()
  updated_at: Date
}

