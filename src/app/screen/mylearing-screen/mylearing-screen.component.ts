import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Course } from 'src/app/models/course.model';
import { User } from 'src/app/models/user.model';
import { CourseService } from 'src/app/service/course.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-mylearing-screen',
  templateUrl: './mylearing-screen.component.html',
  styleUrls: ['./mylearing-screen.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class MylearingScreenComponent implements OnInit {

  myCourseList:Course[]=[];
  searchedCourses: Course[]=[];
  learner = new User();
  isLoading= true;
  courseAmount=0;

  constructor(
    private courseService: CourseService,
    private router: ActivatedRoute,
    private userService: UserService,
    private route: Router
    ) { }

  ngOnInit(): void {

    let isLoggin=localStorage.getItem('isLoggedin');
    if(isLoggin=="true"){
      let email=localStorage.getItem('uemail');
      if(email!=null)
        this.userService.getUserByEmail(email)
        .subscribe(responseData=> {
          this.learner= responseData.users[0]
          this.getMyCourses();
        })
    }
    else{
      this.route.navigate(['/login'] )
    }
  
  }

  getMyCourses(){ 
    //get enrollment list , get all course, filter course by enrollment.courseId
    this.courseService.getMyCourses(this.learner.id)
    .pipe(
      catchError((error)=>{
         
          if(error.error.count==0)
            this.isLoading= false;
          this.courseAmount=0;
          return throwError(error)         
      })
    )
    .subscribe(enrollmentData=>{
      console.log("Enrollment")
      console.log(enrollmentData.enrollments)
      this.courseService.getAllCourse().subscribe(courseData=>{
          
          enrollmentData.enrollments.forEach(enrollment => {
              let course=courseData.courses.find(course => course.id === enrollment.courseId);
              if(course)      
              this.myCourseList.push(course);
          });
         
          this.courseAmount= this.myCourseList.length;
          this.isLoading=false;
      })
    })
    
  }

  searchCourse(input:string){
    console.log(input);
    this.searchedCourses =this.myCourseList.filter(course=> course.title.toLowerCase().includes(input.toLowerCase()) ); 
  }

}
