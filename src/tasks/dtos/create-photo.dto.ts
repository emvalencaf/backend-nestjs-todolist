import { IsString, IsUrl } from 'class-validator';

export class CreatePhotoDTO {
    @IsString()
    @IsUrl()
    url: string;
}
