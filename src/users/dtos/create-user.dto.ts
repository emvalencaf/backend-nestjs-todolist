import {
    IsEmail,
    IsNotEmpty,
    IsString,
    IsDateString,
    Length,
} from 'class-validator';

export class CreateUserDTO {
    @IsNotEmpty()
    @IsString()
    @Length(2, 50)
    firstName: string;

    @IsNotEmpty()
    @IsString()
    @Length(2, 50)
    lastName: string;

    @IsNotEmpty()
    @IsDateString()
    birthday: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Length(8, 100)
    password: string;
}
