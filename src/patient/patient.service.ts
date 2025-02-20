import { Injectable } from '@nestjs/common';
import { PatientEntity } from './patient.entity';
import { readFileSync } from 'fs';
import { plainToInstance } from 'class-transformer';
import { PatientMetadataDto } from './dtos/patient-metadata.dto';
const INPUT_FILE_NAME = 'patients.json';
const ENCODING = 'utf-8';
@Injectable()
export class PatientService {
  private mapPatientById: Map<number, PatientEntity> = new Map<number, PatientEntity>;

  onModuleInit() {
    const patients = this.getPatientsFromFile(INPUT_FILE_NAME);
    this.storePatientsInMap(patients);
  }

  public findPatientById(id: number): PatientEntity {
    return this.mapPatientById.get(id);
  }

  public increamnetNumberOfRequests(patient: PatientEntity): void {
    if (patient) {
      patient.numberOfReuqests++;
    }
  }

  public createPatient(newEntity: PatientEntity): PatientEntity {
    newEntity.id = this.mapPatientById.size + 1;
    this.mapPatientById.set(newEntity.id, newEntity);
    return newEntity;
  }

  public getPatientsMetadata(): PatientMetadataDto[] {
    const patientMetadataDtos = [];
    const metadataArray = Array.from(this.mapPatientById.values());
    metadataArray.forEach(patientEntity => {
      patientMetadataDtos.push(new PatientMetadataDto(patientEntity.name, patientEntity.numberOfReuqests));
    });
    return patientMetadataDtos;
  }

  private getPatientsFromFile(fileName: string) {
    const fileContents = readFileSync(fileName, ENCODING);
    const parsedFileContents: any[] = JSON.parse(fileContents);
    return plainToInstance(PatientEntity, parsedFileContents);
  }

  private storePatientsInMap(patients: PatientEntity[]) {
    patients.forEach(patient => {
      this.mapPatientById.set(patient.id, patient);
    });
  }

}
