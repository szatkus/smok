import { Component } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';

import { Lesson } from './Lesson';

import * as $ from 'jquery';

@Component({  
    selector: 'confirm',
    templateUrl: './confirm.component.html'
})
export class ConfirmComponent extends DialogComponent<Lesson, Lesson> {
  constructor(dialogService: DialogService) {
    debugger;
    super(dialogService);
  }
  confirm($event) {
    debugger;
    //change to jQuery
    this.result = { classNumber: $event.toElement.parentElement.parentElement.children[1].children[2].children[1].value,
                    subject: $event.toElement.parentElement.parentElement.children[1].children[1].children[1].value,
                    teacher: $event.toElement.parentElement.parentElement.children[1].children[0].children[1].value};
    this.close();
  }
}
