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
        this.userService.getAllUser()
        .subscribe(responseData=> {
          let learner_= responseData.users.find((user)=> user.email===email);
          if(learner_)
            this.learner= learner_;
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

      this.courseService.getAllCourse().subscribe(courseData=>{
          
          enrollmentData.enrollments.forEach(enrollment => {
              let course=courseData.courses.find(course => course.id === enrollment.courseId);
              
              if(course) 
              {
                course.purchasedAt= enrollment.createdAt;
                if(!this.myCourseList.includes(course))
                this.myCourseList.push(course);
              }     
              
          });

          this.myCourseList= this.myCourseList.sort((a,b)=>{return <any>new Date(b.purchasedAt?b.purchasedAt:b.createdAt) - <any>new Date(a.purchasedAt?a.purchasedAt:a.updatedAt)})
         
          this.courseAmount= this.myCourseList.length;
          this.isLoading=false;
      })
    })
    
  }

  searchCourse(input:string){
    this.searchedCourses =this.myCourseList.filter(course=> course.title.toLowerCase().includes(input.toLowerCase()) ); 
  }

}
