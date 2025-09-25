import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateTeacherDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  schoolId: string;
}

export class CreateTeacherResponseDto {
  statusCode: number;
  message?: string;
  data?: any;
  error? : string;
}
