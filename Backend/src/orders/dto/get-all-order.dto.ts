import { IsOptional, IsString, IsInt, Min } from "class-validator";
import { Type } from "class-transformer";

export class GetAllQueryOrder {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;
}

export class GetAllOrderResponseDto {
  orders: any;
  statusCode: number;
  message: string;
  total?: number;
  page?: number;
  limit?: number;
}
