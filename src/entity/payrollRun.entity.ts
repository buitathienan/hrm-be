import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PayrollRecord } from "./payrollRecord.entity";

export enum PayrollStatus {
  DRAFT = "draft",
  APPROVED = "approved",
  PROCESSED = "processed",
  PAID = "paid",
}

@Entity()
export class PayrollRun {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  payPeriodStart: Date;

  @Column()
  payPeriodEnd: Date;

  @Column({ nullable: true })
  payDate: Date;

  @Column({ nullable: true, type: "decimal" })
  totalGross: number;

  @Column({ nullable: true, type: "decimal" })
  totalDeductions: number;

  @Column({ nullable: true, type: "decimal" })
  totalNet: number;

  @OneToMany(() => PayrollRecord, (payrollRecord) => payrollRecord.payrollRun)
  payrollRecord: PayrollRecord[];

  @Column()
  status: PayrollStatus;

  @CreateDateColumn()
  createdDate: Date;
}
