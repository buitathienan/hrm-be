import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  Gender,
  EmploymentType,
  EmploymentStatus,
} from 'src/generated/prisma/enums';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  hireDate: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  probationEnd?: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  confirmationDate?: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  terminationDate?: Date;

  @IsEnum(EmploymentType)
  @IsOptional()
  employmentType?: EmploymentType;

  @IsEnum(EmploymentStatus)
  @IsOptional()
  employmentStatus?: EmploymentStatus;

  @IsNumber()
  departmentId: number;

  @IsNumber()
  @IsOptional()
  managerId?: number;

  @IsNumber()
  @IsOptional()
  userId?: number;
}
