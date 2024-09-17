import { IsInt } from 'class-validator';

export class SignInPayloadDTO {
    @IsInt()
    id: number;
}
