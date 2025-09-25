import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateForgetPassword {
  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;
}

export class CreateForgetPasswordResponseDto {
  message: string;
  statusCode: number;
}
