import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class QueryAllStudent {
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

export class AllStudentResponse {
  data: any[];
  statusCode: number;
  total: number;
  page: number;
  limit: number;
}
