import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { PatientService } from './patient.service';
import { PatientResponseDto } from './dtos/patient-response.dto';
import { PatientEntity } from './patient.entity';
import { PatientCreateDto } from './dtos/patient-create.dto';
import { PatientMetadataDto } from './dtos/patient-metadata.dto';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) { }

  @Get('metadata')
  getPatientsMetadata(): PatientMetadataDto[] {
    return this.patientService.getPatientsMetadata();
  }

  @Get(':id')
  getPatientById(@Param('id') id: number): PatientResponseDto {
    const patientEntityFound = this.patientService.findPatientById(Number(id));
    if (patientEntityFound) {
      this.patientService.increamnetNumberOfRequests(patientEntityFound);
      return new PatientResponseDto(patientEntityFound.name, patientEntityFound.age);
    }
  }

  @Post()
  createNewPatient(@Body() dto: PatientCreateDto): number {
    const newEntity = new PatientEntity();
    newEntity.name = dto.name;
    newEntity.age = dto.age;
    newEntity.created_at = new Date();
    this.patientService.createPatient(newEntity);
    return newEntity.id;
  }
}
