import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { BookingDto, CreateSlotDto, DoctorDto } from './dto/app.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("doctors")
  async postDoctors(@Body() doctor: DoctorDto){
    return this.appService.createDoctor(doctor);
  }

  @Post('doctors/:doctorId/slots')
  async createSlot(@Param('doctorId') doctorId: string, @Body() createSlotDto: CreateSlotDto){
    return this.appService.createSlots(doctorId, createSlotDto)
  }

  @Post('slots/:slotId/book')
  async createAppointment(@Param('slotId') slotId: string, @Body() bookingDto: BookingDto){
    return this.appService.bookSlot(slotId, bookingDto)
  }

  @Get('doctors/:doctorId/bookings')
  async getBookedSlots(
    @Param('doctorId') doctorId: string,
    @Query('start_date') startDate: string,
    @Query('end_date') endDate: string,
  ) {
    return this.appService.getBookedSlots(doctorId, startDate, endDate);
  }

  @Get('doctors/:doctorId/available_slots')
  async getAvailableSlots(
    @Param('doctorId') doctorId: string,
    @Query('date') date: string,
  ) {
    return this.appService.getAvailableSlots(doctorId, date);
  }
}
