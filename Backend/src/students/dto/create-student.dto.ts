import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsMongoId,
  Min,
  Max,
} from 'class-validator';

export class CreateStudentDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name should not be empty' })
  name: string;

  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Total fees should not be empty' })
  @IsNumber({}, { message: 'Total fees must be a number' })
  @Min(1, { message: 'Total fees must be greater than 0' })
  totalFees: number;

  @IsNotEmpty({ message: 'School ID should not be empty' })
  @IsMongoId({ message: 'School ID must be a valid MongoDB ObjectId' })
  schoolId: string;

  @IsNotEmpty({ message: 'Months should not be empty' })
  @IsNumber({}, { message: 'Months must be a number' })
  @Min(1, { message: 'Months must be at least 1' })
  @Max(12, { message: 'Months cannot exceed 12' })
  months: number;

  @IsNotEmpty({ message: 'Monthly payment should not be empty' })
  @IsNumber({}, { message: 'Monthly payment must be a number' })
  @Min(1, { message: 'Monthly payment must be greater than 0' })
  monthPayment: number;
}

export class CreateStudentResponseDto {
  message: string;
  data: any;
  statusCode: number;
}
