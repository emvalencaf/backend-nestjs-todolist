import { IsEmail, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class GetUserByEmailDTO {
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsBoolean()
    @IsOptional()
    showPassword: boolean = false;
}
