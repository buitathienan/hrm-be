import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Tax {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  year: number;

  @Column({ type: "decimal", precision: 5, scale: 4 })
  rate: number;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  minIncome: number;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  maxIncome: number;

  @Column({ type: "date" })
  effectiveDate: Date;

  @CreateDateColumn()
  createdDate: Date;
}
