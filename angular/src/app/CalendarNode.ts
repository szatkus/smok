import { Lesson } from './Lesson';

export class CalendarNode {
  lesson: Lesson;
  day: string;
  hour: Date;
  calendarName: string;

  constructor(_lesson: Lesson, _day: string, _hour: Date, _calendarName: string) {
    this.lesson = _lesson;
    this.day = _day;
    this.hour = _hour;
    this.calendarName = _calendarName;
  }
}
