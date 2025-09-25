import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'School', required: true })
  school_id: Types.ObjectId;

  @Prop({ type: String,  required: true })
  trustee_id: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  student_info: Types.ObjectId;

  @Prop({ type: String, required: true })
  gateway_name: string;

  @Prop({ type: String, required: true })
  types: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
