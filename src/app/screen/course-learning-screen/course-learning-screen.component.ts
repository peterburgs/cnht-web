import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/service/course.service';
import { Course } from 'src/app/models/course.model';
import { Observable, of } from 'rxjs';
import { UserService } from 'src/app/service/user.service';
import { User } from 'src/app/models/user.model';

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
  learner = new User()
  hidden_comment=true;

  constructor(
    private route: ActivatedRoute,
    private courseService:CourseService,
    private _sanitizer: DomSanitizer,
    private userService: UserService,
    private router: Router
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
      this.courseService.getCourseById(id).subscribe(course=>{this.current_course= course.courses[0]})
   })

    this.sectionId.subscribe(sectionId=>{
        
     })

   //If user don't login, navigate to detail course screen
    let isLoggin=localStorage.getItem('isLoggedin');
    if(isLoggin=="true"){
      let email=localStorage.getItem('uemail');
      if(email!=null)
        this.userService.getUserByEmail(email)
        .subscribe(responseData=> {
          this.learner= responseData.users[0]
          this.checkEnrolled();
        })
      
    }
    else{
      this.router.navigate(['/detail',this.current_course.id] )
    }

    

    //TODO: GET VIDEO OF LECTURE
    this.videoURL= this._sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/zcAalMeaKso");
    // this.courseService.getCourseById(id).subscribe(course => this.current_course= course);

  }

  checkEnrolled(){
    this.userService.checkEnrollment(this.current_course.id, this.learner.id)
    .subscribe(data=>{ 
      if(data.count==0){
        this.router.navigate(['/detail',this.current_course.id] )
      }
    })
  }

}
