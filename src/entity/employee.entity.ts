import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";
import { Department } from "./department.entity";
import { EmployeePayroll } from "./employeePayroll.entity";
import { PayrollRecord } from "./payrollRecord.entity";
import { Attendance } from "./attendance.entity";
import { LeaveBalance } from "./leaveBalance.entity";
import { LeaveRequest } from "./leaveRequest.entity";
import { EmploymentType } from "./employementType.entity";
import { Designation } from "./designation.entity";

export enum gender {
  MALE = "Male",
  FEMALE = "Female",
  OTHER = "Other",
}

export enum EmployeeStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ type: "enum", enum: gender })
  gender: gender;

  @Column({ type: "date" })
  dob: Date;

  @Column({
    unique: true,
    length: 100,
    nullable: true,
  })
  email: string;

  @Column({
    unique: true,
    length: 15,
    nullable: true,
  })
  phone: string;

  @Column({ type: "date" })
  hireDate: Date;

  @Column({
    unique: true,
    nullable: true,
  })
  passport: string;

  @Column({
    nullable: true,
    length: 255,
  })
  address: string;

  @Column({
    nullable: true,
  })
  avatar: string;

  @OneToOne(() => User, (user) => user.employee, { nullable: true })
  user: User;

  @ManyToOne(() => Employee, (employee) => employee.subordinates, {
    nullable: true,
    onDelete: "SET NULL",
  })
  manager: Employee;

  @OneToMany(() => Employee, (employee) => employee.manager, { nullable: true })
  subordinates: Employee[];

  @ManyToOne(() => Department, (department) => department.employees, {
    nullable: true,
    onDelete: "SET NULL",
  })
  department: Department;

  @OneToOne(
    () => EmployeePayroll,
    (employeePayRoll) => employeePayRoll.employee,
    { nullable: true }
  )
  payroll: EmployeePayroll;

  @OneToMany(() => PayrollRecord, (payrollRecord) => payrollRecord.employee, {
    nullable: true,
  })
  payrollRecord: PayrollRecord[];

  @OneToMany(() => Attendance, (attendance) => attendance.employee, {
    nullable: true,
  })
  attendances: Attendance[];

  @OneToMany(() => LeaveBalance, (leaveBalance) => leaveBalance.employee, {
    nullable: true,
  })
  leaveBalances: LeaveBalance[];

  @OneToMany(() => LeaveRequest, (leaveRequest) => leaveRequest.employee, {
    nullable: true,
  })
  leaveRequests: LeaveRequest[];

  @OneToOne(() => EmploymentType, { eager: true, nullable: true })
  @JoinColumn()
  employmentType: EmploymentType;

  @OneToOne(() => Designation, { eager: true, nullable: true })
  @JoinColumn()
  designation: Designation;

  @Column({
    type: "enum",
    enum: EmployeeStatus,
    default: EmployeeStatus.ACTIVE,
  })
  status: EmployeeStatus;

  @CreateDateColumn()
  createdDate: Date;
}
