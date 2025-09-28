import {
  IsString,
  IsNumber,
  IsMongoId,
  IsOptional,
  Matches,
} from 'class-validator';

export class CreatePaymentBodyDto {
  @IsString()
  collect_id: string;

  @IsNumber()
  order_amount: number;

  @IsString()
  email: string;

  @IsString()
  name: string;

  @IsMongoId()
  student_id: string;

  @IsOptional()
  @IsString()
  order_id?: string;

  @IsString()
  @Matches(/^\d{10}$/, { message: 'Phone number must be 10 digits' })
  phone: string;
}

export class CreatePaymentResponseDto {}
