import { HeartMonitorReadingCreateDto } from './heart-monitor-reading-create.dto';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { HeartMonitorService } from './heart-monitor.service';
import { HeartMontiorReadingEntity } from './entities/heart-monitor-reading.entity';
import { HeartRateAnalytics as HeartRateAnalytics } from './entities/heart-monitor-reading-anytics.entity';

@Controller('heart-monitor')
export class HeartMonitorController {
  constructor(private readonly heartMonitorService: HeartMonitorService) { }

  @Post()
  addNewReading(@Body() dto: HeartMonitorReadingCreateDto): number {
    let newEntity = new HeartMontiorReadingEntity();
    newEntity.patient_id = dto.patient_id;
    newEntity.reading_time = new Date(dto.time);
    newEntity.value = dto.value;
    newEntity = this.heartMonitorService.createReading(newEntity);
    return newEntity.id;
  }

  @Get("highHeartRateEvents")
  getHighHeartRateEvents(): HeartMonitorReadingCreateDto[] {
    return this.heartMonitorService.getHighHeartRateMontiroReadings();
  }

  @Get("heartRateEventsAnalytics")
  getPatientsAnyticsEntity(@Query("startTimeRange") startTimeRange: string, @Query("endTimeRange") endTimeRange: string): HeartRateAnalytics {
    return this.heartMonitorService.getheartRateEventsAnalytics(new Date(startTimeRange), new Date(endTimeRange));
  }
}
