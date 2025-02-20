import { Module } from '@nestjs/common';
import { PatientModule } from './patient/patient.module';
import { HeartMonitorModule } from './heart-monitor/heart-monitor.module';

@Module({
  imports: [PatientModule, HeartMonitorModule],
})
export class AppModule {}
