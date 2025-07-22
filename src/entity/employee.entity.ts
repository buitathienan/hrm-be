import {
  Column,
  CreateDateColumn,
  Entity,
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

export enum gender {
  MALE = "Male",
  FEMALE = "Female",
  OTHER = "Other",
}

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({type: "enum", enum: gender})
  gender: gender;

  @Column()
  dob: Date;

  @Column({
    unique: true,
    length: 100,
  })
  email: string;

  @Column({
    unique: true,
    length: 15,
  })
  phone: string;

  @Column()
  hireDate: Date;

  @Column({
    unique: true,
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

  @Column()
  jobTitle: string;

  @OneToOne(() => User, (user) => user.employee, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Employee, (employee) => employee.subordinates, {
    nullable: true,
    onDelete: "SET NULL",
  })
  manager: Employee;

  @OneToMany(() => Employee, (employee) => employee.manager)
  subordinates: Employee[];

  @ManyToOne(() => Department, (department) => department.employees, {
    nullable: true,
    onDelete: "SET NULL",
  })
  department: Department;

  @OneToOne(
    () => EmployeePayroll,
    (employeePayRoll) => employeePayRoll.employee
  )
  payroll: EmployeePayroll;

  @OneToMany(() => PayrollRecord, (payrollRecord) => payrollRecord.employee)
  payrollRecord: PayrollRecord[]
  
  @OneToMany(() => Attendance, (attendance) => attendance.employee)
  attendances: Attendance[]

  @OneToMany(() => LeaveBalance, (leaveBalance) => leaveBalance.employee)
  leaveBalances: LeaveBalance[]

  @OneToMany(() => LeaveRequest, (leaveRequest) => leaveRequest.employee)
  leaveRequests: LeaveRequest[]  

  @CreateDateColumn()
  createdDate: Date;
}
