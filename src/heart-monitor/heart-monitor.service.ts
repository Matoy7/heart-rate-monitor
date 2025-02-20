import { Injectable, OnModuleInit } from '@nestjs/common';
import { HeartMontiorReadingEntity } from './entities/heart-monitor-reading.entity';
import { HeartMonitorReadingCreateDto } from './heart-monitor-reading-create.dto';
import { HeartRateAnalytics as HeartRateAnalytics } from './entities/heart-monitor-reading-anytics.entity';

const HIGH_LEVEL_HEART_RETE = 100;
@Injectable()
export class HeartMonitorService implements OnModuleInit {
  private heartMontiroReadings: HeartMontiorReadingEntity[];
  private highHeartRateMontiroReadings: HeartMonitorReadingCreateDto[];

  onModuleInit() {
    this.heartMontiroReadings = [];
    this.highHeartRateMontiroReadings = [];
  }

  public createReading(newEntity: HeartMontiorReadingEntity): HeartMontiorReadingEntity {
    if (this.heartMontiroReadings) {
      newEntity.id = (this.heartMontiroReadings.at(-1)?.id ?? 0) + 1;
      this.heartMontiroReadings.push(newEntity);
      if (newEntity.value > HIGH_LEVEL_HEART_RETE) {
        this.updateHighHeartRateReadings(newEntity);
      }
      return newEntity;
    }
  }

  public getheartRateEventsAnalytics(startTimeRange: Date, endTimeRange: Date): HeartRateAnalytics {
    const heartRateAnalytics = new HeartRateAnalytics(null, null, null);
    const readingsFilterByDateRange = this.heartMontiroReadings.filter(function (heartMontiroReading: HeartMontiorReadingEntity) {
      return startTimeRange <= heartMontiroReading.reading_time && heartMontiroReading.reading_time <= endTimeRange;
    });
    for (let i = 0; i < readingsFilterByDateRange.length; i++) {
      this.updateHeartRateEventsAnalytics(readingsFilterByDateRange[i], heartRateAnalytics, i);
    }
    return heartRateAnalytics;
  }

  public getHighHeartRateMontiroReadings(): HeartMonitorReadingCreateDto[] {
    return this.highHeartRateMontiroReadings;
  }

  private updateHighHeartRateReadings(newEntity: HeartMontiorReadingEntity) {
    const heartMonitorReadingCreateDto = new HeartMonitorReadingCreateDto(newEntity.patient_id, newEntity.value, newEntity.reading_time.toString());
    this.highHeartRateMontiroReadings.push(heartMonitorReadingCreateDto);

  }

  private updateHeartRateEventsAnalytics(heartMontiorReadingEntity: HeartMontiorReadingEntity, heartRateAnalytics: HeartRateAnalytics, currentNumberOfReads: number) {
    if (currentNumberOfReads == 0) {
      heartRateAnalytics.average = heartMontiorReadingEntity.value;
      heartRateAnalytics.maximum = heartMontiorReadingEntity.value;
      heartRateAnalytics.minimum = heartMontiorReadingEntity.value;
    } else {
      const sumOfTotalReadingsValues = heartRateAnalytics.average * currentNumberOfReads;
      heartRateAnalytics.average = (sumOfTotalReadingsValues + heartMontiorReadingEntity.value) / (currentNumberOfReads + 1);
      if (heartRateAnalytics.maximum < heartMontiorReadingEntity.value) {
        heartRateAnalytics.maximum = heartMontiorReadingEntity.value;
      }
      if (heartRateAnalytics.minimum > heartMontiorReadingEntity.value) {
        heartRateAnalytics.minimum = heartMontiorReadingEntity.value;
      }
    }
  }
}
