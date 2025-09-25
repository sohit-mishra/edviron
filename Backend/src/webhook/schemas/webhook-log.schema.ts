import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type WebhookLogDocument = WebhookLog & Document;

@Schema({ timestamps: true })
export class WebhookLog {
  @Prop({ type: Types.ObjectId, ref: 'Order' })
  orderId: Types.ObjectId;

  @Prop({ required: true })
  gateway: string; 

  @Prop({ type: Object, required: true })
  payload: Record<string, any>; 
  
  @Prop({ default: 'pending' })
  status: string;

  @Prop()
  message?: string; 
}

export const WebhookLogSchema = SchemaFactory.createForClass(WebhookLog);
