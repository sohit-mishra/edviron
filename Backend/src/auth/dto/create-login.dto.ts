import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class CreateLoginDto {
  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password should not be empty' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}

export class CreateLoginResponseDto {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: any;
  statusCode: number;
}
