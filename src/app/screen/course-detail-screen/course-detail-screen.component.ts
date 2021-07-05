import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from 'src/app/service/course.service';
import { Course } from 'src/app/models/course.model';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-course-detail-screen',
  templateUrl: './course-detail-screen.component.html',
  styleUrls: ['./course-detail-screen.component.css']
})
export class CourseDetailScreenComponent implements OnInit {

  
  selectedCourse = new Course();
  courseId!: Observable<string>;
  constructor(
    private service: CourseService,
    private route: ActivatedRoute
    ) { }

  ngOnInit(): void {   

   
    this.route.params.subscribe(params=>{
      this.courseId= of(params['id']);
      
    })

    this.courseId.subscribe(id=>{
      this.service.getCourseById(id).subscribe(course =>  this.selectedCourse= course);

    })

    console.log(this.courseId)
  }

}
