import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class DoctorDto {
    @IsString()
    @IsNotEmpty()
    username: string;
    
    @IsString()
    @IsNotEmpty()
    first_name: string;
    
    @IsString()
    @IsNotEmpty()
    last_name: string;
    
    @IsEmail()
    @IsNotEmpty()
    email: string;
}

export class CreateSlotDto{
    @IsString()
    start_time: string;
    
    @IsString()
    end_time: string;
    
    @IsString()
    repeat_until?: string;
    
    @IsString()
    recurrence?: 'daily' | 'weekly' | 'monthly';
}

export class BookingDto {
    @IsString()
    @IsNotEmpty()
    patient_name: string;
  }