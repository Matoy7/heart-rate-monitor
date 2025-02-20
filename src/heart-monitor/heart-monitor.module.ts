import { Module } from '@nestjs/common';
import { HeartMonitorController } from './heart-monitor.controller';
import { PatientModule } from '../patient/patient.module';
import { HeartMonitorService } from './heart-monitor.service';

@Module({
  imports: [PatientModule],
  controllers: [HeartMonitorController],
  providers: [HeartMonitorService],
})
export class HeartMonitorModule {}
