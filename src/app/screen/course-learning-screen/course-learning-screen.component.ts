import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/service/course.service';
import { Course } from 'src/app/models/course.model';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-course-learning-screen',
  templateUrl: './course-learning-screen.component.html',
  styleUrls: ['./course-learning-screen.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class CourseLearningScreenComponent implements OnInit {

  current_course = new Course();
  courseId!: Observable<string>;
  sectionId!:Observable<string>;
  lectureId!:string;
  videoURL : any;

  constructor(
    private route: ActivatedRoute,
    private courseService:CourseService,
    private _sanitizer: DomSanitizer
    ) {

      
     }

  ngOnInit(): void {
    //Get id course, section and lecture  from url and find course by id
    this.route.params.subscribe(params=>{
      this.courseId= of(params['courseId']);
      this.lectureId= params['lectureId'];
      this.sectionId= of(params['sectionId']);
    })

    this.courseId.subscribe(id=>{
        this.courseService.getCourseById(id).subscribe(course=>{this.current_course= course})
    })

    this.videoURL= this._sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/zcAalMeaKso");
    // this.courseService.getCourseById(id).subscribe(course => this.current_course= course);

  }

}
