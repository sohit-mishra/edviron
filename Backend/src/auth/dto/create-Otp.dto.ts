import { IsEmail, IsInt, IsNotEmpty, IsString, Length, Max, Min } from 'class-validator';

export class CreateOtpDto {
  @IsInt({ message: 'OTP must be a number' })
  @Min(100000, { message: 'OTP must be 6 digits' })
  @Max(999999, { message: 'OTP must be 6 digits' })
  otp: number;

  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;
}

export class CreateOtpResponseDto {
  message: string;
  statusCode: number;
}
