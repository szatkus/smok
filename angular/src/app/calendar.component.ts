import { Component, OnInit } from '@angular/core';
import { CalendarService } from './calendar.service';

import { HttpClient } from '@angular/common/http';

import { ConfirmComponent } from './confirm.component';
import { DialogService } from 'ng2-bootstrap-modal';

import { Lesson } from './Lesson';
import { CalendarNode } from './CalendarNode';

@Component({
  selector: 'app-calendar',
  styleUrls: ['./calendar.component.css'],
  templateUrl: './calendar.component.html',
  providers: [CalendarService]
})

export class CalendarComponent implements OnInit {
  public numbers: number[] = [];
  public hours: Date[] = [];
  public monday: Lesson[] = [];
  public tuesday: Lesson[] = [];
  public wednesday: Lesson[] = [];
  public thursday: Lesson[] = [];
  public friday: Lesson[] = [];

  public constructor(private calendarService: CalendarService, private dialogService: DialogService, private http: HttpClient) {
  }
  getHours(): void {
    this.calendarService.generateHours().then(x => this.hours = x);
  }
  getNumbers(): void {
    this.calendarService.generateNumbers().then(x => this.numbers = x);
  }

  ngOnInit(): void {
    this.getHours();
    this.getNumbers();
  }

  setSubject(day: string, i: number, value: Lesson): void {
    if (day === 'monday') {
      this.monday[i] = value;
    }
    if (day === 'tuesday') {
      this.tuesday[i] = value;
    }
    if (day === 'wednesday') {
      this.wednesday[i] = value;
    }
    if (day === 'thursday') {
      this.thursday[i] = value;
    }
    if (day === 'friday') {
      this.friday[i] = value;
    }
  }

  getLesson(day: string, index: number): Lesson {
    if (day === 'monday') {
      return this.monday[index];
    }
    if (day === 'tuesday') {
      return this.tuesday[index];
    }
    if (day === 'wednesday') {
      return this.wednesday[index];
    }
    if (day === 'thursday') {
      return this.thursday[index];
    }
    if (day === 'friday') {
      return this.friday[index];
    }
  }

  // postLesson(node: CalendarNode): void {
  //   this.http.post('/calendar/add', node);
  // }

  public showConfirm(index, day, $event) {
    debugger;
    let existingLesson: Lesson;
    existingLesson = this.getLesson(day, index);
    this.dialogService.addDialog(ConfirmComponent, existingLesson)
        .subscribe((lesson) => {
          debugger;
            if (lesson !== undefined && lesson.subject !== '') {
              this.setSubject(day, index, lesson);
              let node = new CalendarNode(lesson, day, new Date(), 'some name');
              // this.postLesson(node);
              $event.toElement.parentElement.style.backgroundColor = '#992626';
            }
        });
}
}
