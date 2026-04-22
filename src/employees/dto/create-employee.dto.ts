import { IsDate, IsEmail, IsString } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  employeeNumber: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsEmail()
  workEmail: string;

  @IsDate()
  hireDate: Date;
}
