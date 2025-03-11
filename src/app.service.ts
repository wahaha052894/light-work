import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { addMinutes, addDays, isBefore, parseISO } from 'date-fns';
import { BookingDto, CreateSlotDto, DoctorDto } from './dto/app.dto';
import { Slot, SlotDocument } from './entities/slot.schema';
import { Doctor, DoctorDocument } from './entities/doctor.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { truncate } from 'node:fs';

@Injectable()
export class AppService {

  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
    @InjectModel(Slot.name) private slotModel: Model<SlotDocument>,
  ){}

  getHello(): string {
    return 'Hello World!';
  }

  async createDoctor(dto: DoctorDto): Promise<Doctor> {
    console.log("DoctorDto", dto)

    const existingDoctor = await this.doctorModel.findOne({ email: dto.email });

    if (existingDoctor) {
      throw new HttpException('Doctor with this email already exists.', HttpStatus.BAD_REQUEST);
    }

    return this.doctorModel.create({
      username: dto.username,
      firstName: dto.first_name,
      lastName: dto.last_name,
      email: dto.email,
      createdAt: new Date(),
    });
  }

  async createSlots(doctorId: string, dto: CreateSlotDto) {
    const start = parseISO(dto.start_time);
    const end = parseISO(dto.end_time);

    if (start >= end) {
      throw new HttpException('End time must be after start time.', HttpStatus.BAD_REQUEST);
    }

    const slotsToCreate: Slot[] = [];
    const recurrenceEndDate = dto.repeat_until ? parseISO(dto.repeat_until) : start;
    const recurrenceType = dto.recurrence || 'none';

    let currentDate = start;

    while (isBefore(currentDate, addDays(recurrenceEndDate, 1))) {
      let slotStart = currentDate;
      while (isBefore(addMinutes(slotStart, 30), addMinutes(currentDate, (end.getTime() - start.getTime()) / 60000 + 1))) {
        const slotEnd = addMinutes(slotStart, 30);

        slotsToCreate.push({
            doctorId: new Types.ObjectId(doctorId),
            startTime: slotStart,
            endTime: slotEnd,
            booked: false,
            recurrenceRule: recurrenceType !== 'none' ? recurrenceType : undefined,
          }
        );

        slotStart = slotEnd;
      }

      switch (recurrenceType) {
        case 'daily':
          currentDate = addDays(currentDate, 1);
          break;
        case 'weekly':
          currentDate = addDays(currentDate, 7);
          break;
        case 'monthly':
          currentDate = addDays(currentDate, 30); // Simplified for example
          break;
        default:
          currentDate = addDays(recurrenceEndDate, 1); // Break loop
          break;
      }
    }

    await this.slotModel.insertMany(slotsToCreate);

    return {
      slots_created: slotsToCreate.length,
      slots: slotsToCreate,
      recurrence: recurrenceType !== 'none' ? recurrenceType : 'single',
    };
  }

  async bookSlot(slotId: string, bookingDto: BookingDto) {
    const slot = await this.slotModel.findById(slotId)
    if (!slot) throw new NotFoundException('Slot not found');
    if (slot.booked) throw new BadRequestException('Slot already booked');
  
    slot.booked = true;
    slot.patientName = bookingDto.patient_name;
    await slot.save();
  
    return slot;
  }

  async getBookedSlots(doctorId: string, startDate: string, endDate: string) {
    const startOfDay = new Date(`${startDate}T00:00:00.000Z`);
    const endOfDay = new Date(`${endDate}T23:59:59.999Z`);

    return this.slotModel.find({
        doctorId: new Types.ObjectId(doctorId),
        booked: true,
        startTime:{ $gte: startOfDay},
        endTime: { $lte: endOfDay},
    });
  }
  
  async getAvailableSlots(doctorId: string, date: string) {
    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);
    
    return this.slotModel.find({
        doctorId: new Types.ObjectId(doctorId),
        booked: false,
        startTime: { $gte: startOfDay, $lte: endOfDay },
    });
  }
  
}
