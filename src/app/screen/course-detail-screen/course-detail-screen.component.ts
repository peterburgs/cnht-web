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

  
  selectedCourse!:Course;
  courseId!:string;
  isLoading = true;
  constructor(
    private service: CourseService,
    private route: ActivatedRoute
    ) { }

  ngOnInit(): void {   

   
    this.route.params.subscribe(params=>{
      this.courseId= params['id'];
      
    })
 
    this.service.getCourseById(this.courseId).subscribe(data =>{
      this.isLoading = false;
      this.selectedCourse= data.courses[0];
    } )
  }

}
