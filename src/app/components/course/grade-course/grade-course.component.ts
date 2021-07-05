import { Component, Input, OnInit } from '@angular/core';
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
export class GradeCourseComponent implements OnInit {

  @Input() grade:GRADES=GRADES.TENTH;
  @Input() typeCourse: COURSE_TYPE = COURSE_TYPE.THEORY;
  smallCourses:Course[]=[];
  constructor(private CourseService:CourseService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.CourseService.getListCourseGrade(this.grade).subscribe(course=> this.smallCourses= course);
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
    this.router.navigate(['search'], {queryParams: {type: this.typeCourse, grade: this.grade }, fragment: 'filter'});

   
  }
}
