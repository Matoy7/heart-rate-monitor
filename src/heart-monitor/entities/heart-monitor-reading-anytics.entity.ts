export class HeartRateAnalytics {
  average: number;
  maximum: number;
  minimum: number;

  constructor(average: number, maximum: number, minimum: number) {
    this.average = average
    this.maximum = maximum
    this.minimum = minimum
  }
}
