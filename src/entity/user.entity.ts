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

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({type: "enum", enum: Role})
  role: Role;

  @OneToOne(() => Employee, (employee) => employee.user)
  @JoinColumn()
  employee: Employee;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdDate: Date;
}
