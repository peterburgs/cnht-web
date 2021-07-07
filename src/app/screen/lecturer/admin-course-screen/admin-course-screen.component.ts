import { Component, OnInit } from '@angular/core';
import { CourseService } from 'src/app/service/course.service';
import { FullCourseService } from 'src/app/service/full-course.service';
import { Course } from 'src/app/models/course.model';
import { ActivatedRoute, Router } from '@angular/router';
import { authenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-admin-course-screen',
  templateUrl: './admin-course-screen.component.html',
  styleUrls: ['./admin-course-screen.component.css'],
})
export class AdminCourseScreenComponent implements OnInit {
  courses: Course[]=[];
  isLoading=true;
  //Login check
  public userDetails? = Object;
  constructor(private router: Router, 
    private route:ActivatedRoute,
    private coursesService: CourseService,
    private fullCourseService : FullCourseService,
    private authSevice: authenticationService) {

       // setTimeout(()=>{
      //   this.courses=this.fullCourseService.getCourses();
      //   },1500);
    }

  ngOnInit(): void {
    this.isLoading=true;
    
    this.fullCourseService.initCourses().subscribe((response)=>{

      this.courses=response.courses;
      this.isLoading=!this.isLoading;
    })
    const storage = localStorage.getItem('google_auth');

    // if (storage) {
    //   this.userDetails = JSON.parse(storage);
    // } else {
    //   this.signOut(); 
    // }
 
    // if (storage) {
    //   this.userDetails = JSON.parse(storage);
    // } else {
    //  // this.signOut();
    // }
    if(this.authSevice.isAdmin())
    this.fullCourseService.initCourses().subscribe((response)=>{
      this.courses=response.courses;
    })
    else this.router.navigateByUrl('/home').then();
  }

  signOut(): void {
    localStorage.removeItem('google_auth');
    this.router.navigateByUrl('/admin/login').then();
  }
  onCreateCourse(){
    this.isLoading=false;
    this.fullCourseService.createCourse();

    const promise= new Promise((resolve, reject)=>{
      setTimeout(()=>{
        this.router.navigate(['../','course',this.fullCourseService.getCourseInfo().id], {relativeTo:this.route}) },2000)
        this.isLoading=true;
      });
  }

}
