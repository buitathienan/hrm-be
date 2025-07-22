import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Employee } from "./employee.entity";

export enum PayType {
  HOURLY = "hourly",
  SALARY = "salary",
}

export enum PayFrequency {
  BIWEEKLY = "biweekly",
  MONTHLY = "monthly",
  WEEKLY = "weekly",
  SEMIMONTHLY = "semimonthly",
}
@Entity()
export class EmployeePayroll {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "enum", enum: PayType })
  payType: PayType;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  baseSalary: number;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  hourlyRate: number;

  @Column({ type: "enum", enum: PayFrequency })
  payFrequency: PayFrequency;

  @Column()
  bankAccount: string;

  @Column()
  bankName: string;

  @Column()
  effectiveDate: Date;

  @CreateDateColumn()
  createdDate: Date;

  @OneToOne(() => Employee, (employee) => employee.payroll)
  employee: Employee;
}
