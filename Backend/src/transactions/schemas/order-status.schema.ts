import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderStatusDocument = OrderStatus & Document & { _id: Types.ObjectId };

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

  @Prop({ type: String })
  status?: string;

  @Prop({ type: String })
  error_message?: string;

  @Prop({ type: Date, required: true })
  payment_time: Date;
}

export const OrderStatusSchema = SchemaFactory.createForClass(OrderStatus);
