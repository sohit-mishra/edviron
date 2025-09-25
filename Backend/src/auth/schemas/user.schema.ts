import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

export enum Role {
  Admin = 'admin',
  Teacher = 'teacher',
  Student = 'student',
}


@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String })
  profile?: string;

  @Prop({ type: String })
  resetToken?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createId?: Types.ObjectId;

  @Prop({ type: Date })
  resetTokenExpires?: Date;

  @Prop({ type: Number })
  totalFees?: number;

  @Prop({ type: Number })
  months?: number;

  @Prop({ type: Number })
  paymentClear?: number;

   @Prop({ type: Number })
  monthPayment?: number;

  @Prop({
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student',
  })
  role: string;

  @Prop({ type: Number })
  verifyAccountOtp?: number;

  @Prop({ type: Types.ObjectId, ref: "School",})
  schoolId?: Types.ObjectId;


  @Prop({ type: Boolean, default: false })
  isVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
