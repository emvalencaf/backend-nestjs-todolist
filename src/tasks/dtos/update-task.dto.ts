import {
    IsBoolean,
    IsDate,
    IsOptional,
    IsString,
    Validate,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { IsFutureDate } from './create-task.dto';

export class UpdateTaskDTO {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    isDone?: boolean;

    @IsDate()
    @Validate(IsFutureDate, {
        message: 'The deadline cannot be earlier than the current date.',
    })
    deadline: Date;
}
