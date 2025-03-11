import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SlotDocument = Slot & Document;

@Schema({ timestamps: true })
export class Slot {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Doctor' })
  doctorId: Types.ObjectId;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({ default: false })
  booked: boolean;

  @Prop()
  recurrenceRule?: string;

  @Prop()
  patientName?: string;
}

export const SlotSchema = SchemaFactory.createForClass(Slot);
