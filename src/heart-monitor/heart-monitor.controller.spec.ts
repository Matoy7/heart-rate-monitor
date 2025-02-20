import { Test, TestingModule } from '@nestjs/testing';
import { HeartMonitorController } from './heart-monitor.controller';
import { HeartMonitorService } from './heart-monitor.service';
import { HeartMonitorReadingCreateDto } from './heart-monitor-reading-create.dto';

describe('HeartMonitorController', () => {
  let controller: HeartMonitorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HeartMonitorController],
      providers: [HeartMonitorService],
    }).compile();

    controller = module.get<HeartMonitorController>(HeartMonitorController);
    await module.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('test create a valid reading', () => {
    const readingTime = new Date("2021-03-06T11:00:00.000Z");
    const response = controller.addNewReading(new HeartMonitorReadingCreateDto(2, 80, "2021-03-06T11:00:00.000Z"));
    expect(response).toBeDefined();
    expect(response).toBe(1);
  });


  it('test getHighHeartRateEvents', () => {
    // 2 reads: just one over 100 (should return just this one...)
    const readingTime1 = "2021-03-06T11:00:00.000Z";
    controller.addNewReading(new HeartMonitorReadingCreateDto(2, 80, readingTime1));
    const readingTime2 = "2022-02-06T11:00:00.000Z";
    controller.addNewReading(new HeartMonitorReadingCreateDto(2, 111, readingTime2));

    const response = controller.getHighHeartRateEvents();
    expect(response).toBeDefined();
    expect(response.length).toBe(1);
    expect(response[0].patient_id).toBe(2);
    expect(response[0].value).toBe(111);
    expect(new Date(response[0].time)).toStrictEqual(new Date(readingTime2));
  });


  it('test getPatientsAnyticsEntity', () => {
    // not relavent reading times for analytics
    const readingTime1 = "2021-03-06T11:00:00.000Z";
    controller.addNewReading(new HeartMonitorReadingCreateDto(2, 1000, readingTime1));
    controller.addNewReading(new HeartMonitorReadingCreateDto(2, 1, readingTime1));

    // relavent reading times for analytics
    const readingTime2 = "2022-02-06T11:00:00.000Z";
    controller.addNewReading(new HeartMonitorReadingCreateDto(4, 100, readingTime2));
    const readingTime3 = "2023-02-06T11:00:00.000Z";
    controller.addNewReading(new HeartMonitorReadingCreateDto(4, 200, readingTime3));

    const response = controller.getPatientsAnyticsEntity(readingTime2, readingTime3);
    expect(response).toBeDefined();
    expect(response.average).toBe(150);
    expect(response.minimum).toBe(100);
    expect(response.maximum).toBe(200);
  });
});
