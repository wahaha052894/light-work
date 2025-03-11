import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Doctor, DoctorSchema } from './entities/doctor.schema';
import { Slot, SlotSchema } from './entities/slot.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // Make the config module global so it can be used throughout the app
    }),
    MongooseModule.forRoot(process.env.MONGOURL || "mongodb://"),
    MongooseModule.forFeature([
      { name: Doctor.name, schema: DoctorSchema },
      { name: Slot.name, schema: SlotSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
