import { Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { COURSE_TYPE } from 'src/app/models/course-type';
import { Course } from 'src/app/models/course.model';
import { GRADES } from 'src/app/models/grades';
import { CourseService } from 'src/app/service/course.service';

@Component({
  selector: 'app-grade-course',
  templateUrl: './grade-course.component.html',
  styleUrls: ['./grade-course.component.css']
})
export class GradeCourseComponent implements OnInit, OnChanges {

  @Input() grade:GRADES=GRADES.TENTH;
  @Input() courseType:  COURSE_TYPE = COURSE_TYPE.THEORY;
  smallCourses:Course[]=[];
  constructor(private CourseService:CourseService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.getCourse();
    
  }

  ngOnChanges(changes:SimpleChanges):void{
      if(changes)
      {
        this.getCourse();
      }
  }

  getCourse(){

    this.smallCourses=[]
    this.CourseService.getListCourseGrade(this.grade, this.courseType)
    .subscribe(data=>{
      if(data.count!=0){
        this.smallCourses= data.courses
        console.log("Hello12")
      }
      else{
        this.smallCourses=[]
      }
    } );

  }


  getLevelGradeName():any{
    return "Grade " +  this.grade;
  }

  viewAllCourse(){
    this.onLoadSearchAllCourse();
  }

  onLoadSearchAllCourse(){
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['search'], {queryParams: {type: this.courseType, grade: this.grade }, fragment: 'filter'});

   
  }
}
