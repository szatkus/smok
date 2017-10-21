import { HOURS, NUMBERS } from './mock-calendar';
import { Injectable } from '@angular/core';

@Injectable()
export class CalendarService {
  generateHours(): Promise<Date[]> {
    return Promise.resolve(HOURS);
  }
  generateNumbers(): Promise<number[]> {
    return Promise.resolve(NUMBERS);
  }
}
