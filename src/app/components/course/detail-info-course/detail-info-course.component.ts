import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Course } from 'src/app/models/course.model';
import { CourseService } from 'src/app/service/course.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-detail-info-course',
  templateUrl: './detail-info-course.component.html',
  styleUrls: ['./detail-info-course.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  providers:[DatePipe]
})
export class DetailInfoCourseComponent implements OnInit {

  @Input() target_course = new Course();
  
  lectureCount:number=0;
  studentJoined: number=0;

  constructor(public courseService: CourseService,
    private datePipe: DatePipe) { }

  ngOnInit(): void {

    //this.getStudentJoinedNumber();
    // this.getLectureByCourseId();

  }


  getStudentJoinedNumber(){
    this.courseService.getstudentJoinedNumber(this.target_course.id).subscribe(
      enrollments=>{
        this.studentJoined= enrollments.length;
      }
    )
  }

  //TODO : get lecture by course id to count
  getLectureByCourseId(){
    // this.courseService.getLectureByCourseId(this.target_course.id)
    // .subscribe(lectures=>{
    //   this.lectureCount= lectures.length;
    // })
    this.lectureCount= 20;
  }

  // dateFormat(date:Date):Date{
  //   return this.datePipe.transform(date,'yyyy-MM-dd')
  // }

}
