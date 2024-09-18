import {
    IsBoolean,
    IsISO8601,
    IsNotEmpty,
    IsOptional,
    IsString,
    Validate,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { Transform } from 'class-transformer';

// Validação customizada para verificar se a data é no futuro
@ValidatorConstraint({ name: 'isFutureDate', async: false })
export class IsFutureDate implements ValidatorConstraintInterface {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    validate(date: string, _args: ValidationArguments) {
        const parsedDate = new Date(date); // Converte a string ISO 8601 para Date
        return parsedDate > new Date(); // Verifica se a data é maior que a data atual
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    defaultMessage(_args: ValidationArguments) {
        return 'The deadline must be a future date.';
    }
}

export class CreateTaskDTO {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    isDone?: boolean = false;

    @IsISO8601({
        strict: false,
        strictSeparator: false,
    })
    @Validate(IsFutureDate, {
        message: 'The deadline cannot be earlier than the current date.',
    })
    deadline: Date; // O tipo é string para corresponder ao @IsDateString
}
