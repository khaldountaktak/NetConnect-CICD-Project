import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsDate, MaxDate, IsString, IsEnum, } from "class-validator";
export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
  }
  

export class CreateUserDto{

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    @IsDate()
    @MaxDate(require('moment')().substract(18,'y').toDate())
    @Type(() => Date)
    dateOfBirth: Date;
    @IsString()
    @IsNotEmpty()
    firstName:string;
    @IsString()
    @IsNotEmpty()
    lastName: string;
    
    @IsEnum(Gender)
    @IsNotEmpty()
    gender: Gender;

}