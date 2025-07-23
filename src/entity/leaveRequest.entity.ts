import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { LeaveBalance } from "./leaveBalance.entity";
import { Employee } from "./employee.entity";

export enum LeaveRequestType {
  PENDING = "pending",
  ACCEPTED = "accepted",
  DENIED = "denied",
}

@Entity()
export class LeaveRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => LeaveBalance, (leaveBalance) => leaveBalance.leaveRequests)
  leaveType: LeaveBalance;

  @Column({ type: "date" })
  fromDate: Date;

  @Column({ type: "date" })
  toDate: Date;

  @Column("decimal", { precision: 5, scale: 2 })
  duration: number;

  @Column({ nullable: true })
  reason: string;

  @ManyToOne(() => Employee, (employee) => employee.leaveRequests)
  employee: Employee;

  @Column({ type: "enum", enum: LeaveRequestType })
  status: LeaveRequestType;

  @Column({ nullable: true })
  approvedById: number;

  @Column({ nullable: true })
  approvedDate: Date;
}
