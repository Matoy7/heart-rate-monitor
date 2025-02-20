export class PatientMetadataDto {
  name: string;
  numberOfReuqests: number;
  constructor(name: string, numberOfReuqests: number) {
    this.name = name
    this.numberOfReuqests = numberOfReuqests
  }
}
