import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsDate,
  MaxDate,
  IsString,
  IsEnum,
} from 'class-validator';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsDate()
  @MaxDate(require('moment')().subtract(18, 'y').toDate())
  @Type(() => Date)
  dateOfBirth: Date;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;
}
