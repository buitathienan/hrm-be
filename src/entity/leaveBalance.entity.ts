import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Employee } from "./employee.entity";
import { LeaveRequest } from "./leaveRequest.entity";

export enum LeaveType {
  CASUAL = "casual",
  PAID = "paid",
}

@Entity()
export class LeaveBalance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "enum", enum: LeaveType })
  leaveType: LeaveType;

  @Column()
  totalTime: number;

  @Column()
  balance: number;

  @ManyToOne(() => Employee, (employee) => employee.leaveBalances)
  employee: Employee;

  @OneToMany(() => LeaveRequest, (leaveRequest) => leaveRequest.leaveType)
  leaveRequests: LeaveRequest[];

  @CreateDateColumn()
  createdDate: Date;
}
