import { IsNotEmpty, IsString, } from 'class-validator';

export class CreateOrderBodyDto {
  @IsString()
  @IsNotEmpty()
  school_id: string;

  @IsString()
  @IsNotEmpty()
  trustee_id: string;

  @IsString()
  @IsNotEmpty()
  student_info: string;

  @IsString()
  @IsNotEmpty()
  gateway_name: string;

  @IsString()
  @IsNotEmpty()
  types: string;
}


export class CreateOrderBodyResponseDto{
    message?: string;
    error?:string;
    data:any;
    statusCode: number;
}