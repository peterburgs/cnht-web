import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Course } from 'src/app/models/course.model';

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.css']
})
export class InfoDialogComponent implements OnInit {
  @Input() public courseInfo: Course = new Course();
  constructor(public activeModal: NgbActiveModal,
                private formBuilder: FormBuilder,
              
                ) { }
  entryForm!: FormGroup;
  error: string | undefined;
  course: Course = new Course();

  ngOnInit(): void {
    
  }
  onCancel

}
