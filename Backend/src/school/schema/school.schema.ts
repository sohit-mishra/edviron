import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type SchoolDocument = School & Document;

@Schema({ timestamps: true })
export class School {
  @Prop({ required: true})
  schoolName: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  sessionStart: Date;

  @Prop({ required: true })
  sessionEnd: Date;

  @Prop({ type: Types.ObjectId, ref: "User", required: true , unique: true})
  adminId: Types.ObjectId;
}

export const SchoolSchema = SchemaFactory.createForClass(School);
