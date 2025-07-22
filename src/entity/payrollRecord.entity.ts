import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PayrollRun } from "./payrollRun.entity";
import { Employee } from "./employee.entity";
import { PayrollRecordItem } from "./payrollRecordItem.entity";


@Entity()
export class PayrollRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PayrollRun, (payrollRun) => payrollRun.payrollRecord)
  payrollRun: PayrollRun;

  @ManyToOne(() => Employee, (employee) => employee.payrollRecord)
  employee: Employee;

  @Column({ type: "decimal" })
  regularHours: number;

  @Column({ type: "decimal" })
  overtimeHours: number;

  @Column({ type: "decimal" })
  grossPay: number;

  @Column({ type: "decimal" })
  netPay: number;

  @OneToMany(() => PayrollRecordItem, (payrollRecordItem) => payrollRecordItem.payrollRecord)
  payrollRecordItems: PayrollRecordItem[]

  @CreateDateColumn()
  createdDate: Date
}
