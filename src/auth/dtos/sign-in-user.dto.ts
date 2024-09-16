import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SignInUserDTO {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Length(8, 100)
    password: string;
}
