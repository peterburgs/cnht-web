import { Component, OnInit } from '@angular/core';
import { CourseService } from 'src/app/service/course.service';
import { FullCourseService } from 'src/app/service/full-course.service';
import { Course } from 'src/app/models/course.model';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-admin-course-screen',
  templateUrl: './admin-course-screen.component.html',
  styleUrls: ['./admin-course-screen.component.css'],
})
export class AdminCourseScreenComponent implements OnInit {
  courses: Course[]=[];
  //Login check
  public userDetails? = Object;
  constructor(private router: Router, 
    private route:ActivatedRoute,
    private coursesService: CourseService,
    private fullCourseService : FullCourseService) {}

  ngOnInit(): void {
    const storage = localStorage.getItem('google_auth');

    if (storage) {
      this.userDetails = JSON.parse(storage);
    } else {
      this.signOut(); 
    }
    this.fullCourseService.getCourses().subscribe((courses)=>{
      this.courses=courses;
    })
  }
  signOut(): void {
    localStorage.removeItem('google_auth');
    this.router.navigateByUrl('/admin/login').then();
  }
  onCreateCourse(){
    this.fullCourseService.createCourse();
    const promise= new Promise((resolve, reject)=>{
      setTimeout(()=>{
        this.fullCourseService.createCourse()},1500)
      });
  
      this.router.navigate(['../','course',this.fullCourseService.getCourseInfo().id], {relativeTo:this.route})
  }
}
