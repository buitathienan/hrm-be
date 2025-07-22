import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PayrollRecord } from "./payrollRecord.entity";

export enum ItemType {
  EARNING = "earning",
  DEDUCTION = "deduction",
  TAX = "tax",
}


@Entity()
export class PayrollRecordItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => PayrollRecord,
    (payrollRecord) => payrollRecord.payrollRecordItems
  )
  payrollRecord: PayrollRecord;

  @Column({type: "enum", enum: ItemType})
  itemType: ItemType;

  @Column()
  code: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  amount: number;

  @CreateDateColumn()
  createdDate: Date;
}
