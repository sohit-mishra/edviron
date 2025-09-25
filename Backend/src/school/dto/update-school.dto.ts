import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class UpdateSchoolAndUpdateDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  schoolName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  phone?: string;

  @IsOptional()
  @IsDateString()
  sessionStart?: string;

  @IsOptional()
  @IsDateString()
  sessionEnd?: string;
}

export class UpdateSchoolAndUpdateResponseDto {
  message: string;
  data: any;
  statusCode: number;
}
