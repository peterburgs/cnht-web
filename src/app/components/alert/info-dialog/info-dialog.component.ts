import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { COURSE_TYPE } from 'src/app/models/course-type';
import { Course } from 'src/app/models/course.model';
import { GRADES } from 'src/app/models/grades';
import { FullCourseService } from 'src/app/service/full-course.service';
import { FormatPrice } from 'src/app/util/priceformat';

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.css'],
})
export class InfoDialogComponent implements OnInit {
  @Input() public courseInfo: Course = new Course();
  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private fullCourseService: FullCourseService
  ) {}
  entryForm!: FormGroup;
  error: string | undefined;
  course: Course = new Course();
  result = false;
  priceFormat: string = '0';
  types = [
    COURSE_TYPE.THEORY,
    COURSE_TYPE.EXAMINATION_SOLVING,
    COURSE_TYPE.TEST,
  ];
  grades = [GRADES.TWELFTH, GRADES.ELEVENTH, GRADES.TENTH];
  ngOnInit(): void {
    this.createForm();
  }
  onCancel() {
    this.result = false;
    this.activeModal.close(this.result);
    this.fullCourseService.createCourse();
  }

  onCreate() {
    this.course.courseType = this.entryForm.value.category;
    this.course.grade = this.entryForm.value.grade;
    this.course.price = parseInt(this.entryForm.value.price.replace(/\D/g, ''));

    if (this.course.title && this.course.courseDescription) {
      this.fullCourseService.setCourse(this.course);
      this.result = true;
      this.activeModal.close(this.result);
    }
  }

  // reactive form
  private createForm() {
    this.entryForm = this.formBuilder.group({
      title: [''],
      description: [''],
      grade: [''],
      category: [''],
      price: [''],
    });
  }
  formatCurrency() {
    let price = parseInt(this.entryForm.value.price.replace(/\D/g, ''));
    this.priceFormat = FormatPrice(price, 0, 3, '.', ',');
  }
}
