export class HeartMontiorReadingEntity {
  id: number;
  patient_id: number;
  value: number;
  reading_time: Date;

  constructor(id = 0, patient_id = 0, value = 0, reading_time = null) {
    this.id = id
    this.patient_id = patient_id
    this.value = value
    this.reading_time = reading_time
  }
}
