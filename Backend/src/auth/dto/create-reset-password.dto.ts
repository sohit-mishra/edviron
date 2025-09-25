import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateResetPasswordDto {
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password should not be empty' })
  password: string;

  @IsString({ message: 'Reset token must be a string' })
  @IsNotEmpty({ message: 'Reset token is required' })
  resetToken: string;
}

export class CreateResetPasswordResponseDto {
  message: string;
  statusCode: number;
}
