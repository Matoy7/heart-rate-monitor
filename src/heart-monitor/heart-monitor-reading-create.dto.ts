export class HeartMonitorReadingCreateDto {
  constructor(patient_id: number, value: number, time: string) {
    this.patient_id = patient_id;
    this.value = value;
    this.time = time;
  }
  patient_id: number;
  value: number;
  time: string;
}
