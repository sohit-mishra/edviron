import { IsString, IsNumber } from "class-validator";

export class CreatePaymentBodyDto {
  @IsString()
  collect_id: string;

  @IsNumber()
  order_amount: number;

  @IsString()
  email: string;

  @IsString()
  name: string;
}


export class CreatePaymentResponseDto{
    
}