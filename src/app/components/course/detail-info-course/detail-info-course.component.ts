import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { Course } from 'src/app/models/course.model';
import { CourseService } from 'src/app/service/course.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-detail-info-course',
  templateUrl: './detail-info-course.component.html',
  styleUrls: ['./detail-info-course.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  providers: [DatePipe],
})
export class DetailInfoCourseComponent implements OnInit, OnChanges {
  @Input() target_course = new Course();

  lectureCount: number = 0;
  studentJoined: number = 0;

  constructor(
    public courseService: CourseService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.getStudentJoinedNumber();
    this.getLectureByCourseId();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getLectureByCourseId();
    this.getStudentJoinedNumber();
  }

  getStudentJoinedNumber() {
    this.courseService
      .getstudentJoinedNumber(this.target_course.id)
      .subscribe((responseData) => {
        this.studentJoined = responseData.count;
      });
  }

  getLectureByCourseId() {
    this.courseService
      .getLectureByCourseId(this.target_course.id)
      .subscribe((data) => {
        this.lectureCount = data.count;
      });
  }
}
