import { Test, TestingModule } from '@nestjs/testing';
import { HeartMonitorService } from './heart-monitor.service';
import { HeartMontiorReadingEntity } from './entities/heart-monitor-reading.entity';

describe('HeartMonitorService', () => {
  let heartMonitorService: HeartMonitorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HeartMonitorService],
    }).compile();

    heartMonitorService = module.get<HeartMonitorService>(HeartMonitorService);
    heartMonitorService.onModuleInit();
  });

  it('should be defined', () => {
    expect(heartMonitorService).toBeDefined();
  });

  it('test create a valid reading', () => {
    const readingTime = new Date("2021-03-06T11:00:00.000Z");
    const response = heartMonitorService.createReading(new HeartMontiorReadingEntity(1, 2, 80, readingTime));
    expect(response).toBeDefined();
    expect(response.id).toBe(1);
    expect(response.patient_id).toBe(2);
    expect(response.value).toBe(80);
    expect(response.reading_time).toBe(readingTime);
  });


  it('test get high heart rate monitor readings', () => {
    // 2 reads: just one over 100 (should return just this one...)
    const readingTime1 = new Date("2021-03-06T11:00:00.000Z");
    heartMonitorService.createReading(new HeartMontiorReadingEntity(1, 2, 80, readingTime1));
    const readingTime2 = new Date("2022-02-06T11:00:00.000Z");
    heartMonitorService.createReading(new HeartMontiorReadingEntity(3, 4, 101, readingTime2));

    const response = heartMonitorService.getHighHeartRateMontiroReadings();
    expect(response).toBeDefined();
    expect(response.length).toBe(1);
    expect(response[0].patient_id).toBe(4);
    expect(response[0].value).toBe(101);
    expect(new Date(response[0].time)).toStrictEqual(readingTime2);
  });


  it('test get heart rsate avents analytics', () => {
    // not relavent reading times for analytics
    const readingTime1 = new Date("2021-03-06T11:00:00.000Z");
    heartMonitorService.createReading(new HeartMontiorReadingEntity(1, 2, 1000, readingTime1));
    heartMonitorService.createReading(new HeartMontiorReadingEntity(1, 2, 1, readingTime1));
    
    // relavent reading times for analytics
    const readingTime2 = new Date("2022-02-06T11:00:00.000Z");
    heartMonitorService.createReading(new HeartMontiorReadingEntity(3, 4, 100, readingTime2));
    const readingTime3 = new Date("2023-02-06T11:00:00.000Z");
    heartMonitorService.createReading(new HeartMontiorReadingEntity(3, 4, 200, readingTime2));

    const response = heartMonitorService.getheartRateEventsAnalytics(readingTime2, readingTime3);
    expect(response).toBeDefined();
    expect(response.average).toBe(150);
    expect(response.minimum).toBe(100);
    expect(response.maximum).toBe(200);
  });
});
