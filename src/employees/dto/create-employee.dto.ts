import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
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
  employeeNumber: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEmail()
  @IsOptional()
  workEmail?: string;

  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  dateOfBirth?: Date;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsString()
  @IsOptional()
  profilePhotoUrl?: string;

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

  @IsEnum(EmploymentType)
  @IsOptional()
  employmentType?: EmploymentType;

  @IsEnum(EmploymentStatus)
  @IsOptional()
  employmentStatus?: EmploymentStatus;

  @IsUUID()
  @IsOptional()
  positionId?: string;

  @IsUUID()
  @IsOptional()
  departmentId?: string;

  @IsUUID()
  @IsOptional()
  managerId?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsUUID()
  @IsOptional()
  scheduleId?: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  terminationDate?: Date;
}
