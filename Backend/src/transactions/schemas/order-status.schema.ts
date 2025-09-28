import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderStatusDocument = OrderStatus &
  Document & { _id: Types.ObjectId };

class StudentInfo {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  student_id: Types.ObjectId;

  @Prop({ type: String, required: true })
  phone: string;
}

@Schema({ timestamps: true })
export class OrderStatus {
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
  collect_id: Types.ObjectId;

  @Prop({ type: Number, required: true })
  order_amount: number;

  @Prop({ type: Number, required: true })
  transaction_amount: number;

  @Prop({ type: String })
  payment_mode?: string;

  @Prop({ type: String })
  payment_details?: string;

  @Prop({ type: String })
  bank_reference?: string;

  @Prop({ type: String })
  payment_message?: string;

  @Prop({
    type: String,
    enum: ['ACTIVE', 'PENDING', 'SUCCESS', 'FAILED'],
    default: 'PENDING',
  })
  status: string;

  @Prop({ type: String })
  error_message?: string;

  @Prop({ type: Date, default: () => new Date() })
  payment_time: Date;

  @Prop({ type: StudentInfo, required: true })
  student_info: StudentInfo;

  @Prop({ type: Types.ObjectId, ref: 'School', required: true })
  school_id: Types.ObjectId;

  @Prop({ type: String, required: true })
  order_id: string;
}

export const OrderStatusSchema = SchemaFactory.createForClass(OrderStatus);
