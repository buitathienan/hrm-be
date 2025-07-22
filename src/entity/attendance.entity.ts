import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Employee } from "./employee.entity";

export enum AttendanceStatus {
  ABSENT = "absent",
  LATE = "late",
  PRESENT = "present",
}

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "timestamp" })
  clockIn: Date;

  @Column({ type: "timestamp" })
  clockOut: Date;

  @ManyToOne(() => Employee, (employee) => employee.attendances)
  employee: Employee;

  @Column({ type: "time", nullable: true })
  workingHours: Date;

  @Column({ type: "time", nullable: true })
  overtime: Date;

  @Column({ type: "enum", enum: AttendanceStatus })
  status: AttendanceStatus;

  @CreateDateColumn()
  createdDate: Date;
}
