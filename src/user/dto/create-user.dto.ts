import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsDate, MaxDate} from "class-validator";
import moment from "moment";
export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
  }
  
  const maxDate= moment().subtract(18,'y').toDate();

export class CreateUserDto{
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    @IsDate()
    @MaxDate(maxDate)
    @Type(() => Date)
    dateOfBirth: Date;
    // @IsString()
    // @IsNotEmpty()
    firstName?:string;
    // @IsString()
    // @IsNotEmpty()
    lastName?: string;
    
    // @IsEnum(Gender)
    // @IsNotEmpty()
    // gender: Gender;

}