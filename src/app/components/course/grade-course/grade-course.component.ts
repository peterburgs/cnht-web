import { Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
  isLoading= true;
  notFound=false;

  constructor(private CourseService:CourseService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    //this.getCourse();
    
  }

  ngOnChanges(changes:SimpleChanges):void{
      if(changes.courseType)
      {
       this.getCourse();
      }
  }

  getCourse(){
    this.smallCourses=[]
    this.CourseService.getListCourseGrade(this.grade, this.courseType)
    .pipe(
      catchError(
        (error)=>{
          this.isLoading=false;
          this.notFound=true;
         return throwError("")
          
      })
    )
    .subscribe(data=>{
      if(data.count!=0){
        this.smallCourses= data.courses.slice(0,4)
        this.notFound=false;
      }

      else{
        this.smallCourses=[]
        this.notFound=true;
        
      }
      this.isLoading=false;
    } );

  }


  getLevelGradeName():any{
    return "Grade " +  this.grade;
  }

  viewAllCourse(){
    this.onLoadSearchAllCourse();
  }

  onLoadSearchAllCourse(){
    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    // this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['search'], {queryParams: {type: this.courseType, grade: this.grade }});

   
  }
}
