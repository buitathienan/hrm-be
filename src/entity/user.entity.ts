import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Employee } from "./employee.entity";

export enum Role {
  ADMIN = "admin",
  HR = "hr",
  EMPLOYEE = "employee",
}

export enum UserGender {
  MALE = "Male",
  FEMALE = "Female",
  NOTCHOOSE = "Not chosen",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true
  })
  email: string;

  @Column()
  name: string;

  @Column({ type: "enum",enum: UserGender ,default: UserGender.NOTCHOOSE })
  gender: UserGender;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: "enum", enum: Role })
  role: Role;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdDate: Date;
}
