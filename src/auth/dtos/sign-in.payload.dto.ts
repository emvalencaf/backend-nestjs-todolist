import { IsUUID } from 'class-validator';

export class SignInPayloadDTO {
    @IsUUID()
    userId: number;
}
