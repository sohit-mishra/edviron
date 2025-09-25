import { Type } from "class-transformer";
import { IsOptional, IsString, IsNumber, Min } from "class-validator";

export class AllTeacherQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number) 
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number) 
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}
export class AllTeacherResponseDto {
  teachers: any[]; 
  statusCode: number;
  totalNumber: number;
  page: number;
  limit: number;
}
