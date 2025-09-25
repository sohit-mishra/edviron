import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsMongoId,
  Min,
  Max,
} from 'class-validator';

export class UpdateStudentDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name should not be empty' })
  name: string;

  @IsNotEmpty({ message: 'Months should not be empty' })
  @IsNumber({}, { message: 'Months must be a number' })
  @Min(1, { message: 'Months must be at least 1' })
  @Max(12, { message: 'Months cannot exceed 12' })
  months: number;
}

export class UpdateStudentResponseDto {
  message: string;
  statusCode: number;
}
