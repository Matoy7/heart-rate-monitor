import { Test, TestingModule } from '@nestjs/testing';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { PatientCreateDto } from './dtos/patient-create.dto';

describe('PatientController', () => {
  let controller: PatientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatientService],
      controllers: [PatientController],
    }).compile();

    controller = module.get<PatientController>(PatientController);

    await module.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('test get patient by id', () => {
    const patient = controller.getPatientById(1);
    expect(patient).toBeDefined();
    expect(patient.name).toEqual("Robert Mckinney");
    expect(patient.age).toBe(78);
  });

  it('test get create new patient', () => {
    const newId = controller.createNewPatient(new PatientCreateDto("Moshe", 11));
    expect(newId).toBeDefined();
    expect(newId).toEqual(10001);
  });

  it('test get patients metadata', () => {
    let metadata = controller.getPatientsMetadata();
    expect(metadata[0]).toBeDefined();
    expect(metadata[0].name).toEqual("Robert Mckinney");
    expect(metadata[0].numberOfReuqests).toBe(0);

    controller.getPatientById(1);
    controller.getPatientById(1);

    metadata = controller.getPatientsMetadata();
    expect(metadata[0]).toBeDefined();
    expect(metadata[0].name).toEqual("Robert Mckinney");
    expect(metadata[0].numberOfReuqests).toBe(2);
  });
});
