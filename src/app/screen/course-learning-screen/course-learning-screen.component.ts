import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/service/course.service';
import { Course } from 'src/app/models/course.model';
import { Observable, of, throwError } from 'rxjs';
import { UserService } from 'src/app/service/user.service';
import { User } from 'src/app/models/user.model';
import { catchError } from 'rxjs/operators';

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
  lectureId!:Observable<string>;
  lectureIdObser!:string;

  videoURL : any;
  learner = new User()
  hidden_comment=true;
  isLoadingVideo= false;

  constructor(
    private route: ActivatedRoute,
    private courseService:CourseService,
    private _sanitizer: DomSanitizer,
    private userService: UserService,
    private router: Router
    ) {}

  ngOnInit(): void {
    //Get id course, section and lecture  from url and find course by id
    this.route.params.subscribe(params=>{
      this.courseId= of(params['courseId']);
      this.lectureId=of(params['lectureId']);
      this.sectionId= of(params['sectionId']);
      console.log("URL change")
      this.lectureId.subscribe(id=>{
        console.log('Params lectureId CHANGE')
        this.lectureIdObser=id;
        this.getVideo(id)
      })
      
    })

    //If user don't log in, navigate to course detail screen
    let isLoggin=localStorage.getItem('isLoggedin');
    if(isLoggin=="true"){
      let email=localStorage.getItem('uemail');
      if(email!=null)
        this.userService.getUserByEmail(email)
        .subscribe(responseData=> {
          this.learner= responseData.users[0]
          this.checkEnrolled();
        })
      
      this.courseId.subscribe(id=>{
        this.courseService.getCourseById(id).subscribe(course=>{this.current_course= course.courses[0]})
      })

      //TODO: GET VIDEO OF LECTURE
      
      
    }
    else{
      this.router.navigate(['/detail',this.current_course.id] )
    }
    
  }

  getVideo(lectureId:string){

    this.isLoadingVideo=true;
    this.courseService.getVideoByLectureId(lectureId)
    .pipe(
      catchError((error)=>{
          console.log(error)
          this.isLoadingVideo= false;
         return throwError(error)
          
      })
    )
    .toPromise().then(data=>{
      console.log("Video is loaded successfully")
      console.log(data)
      this.isLoadingVideo=false;
      this.videoURL=this._sanitizer
      .bypassSecurityTrustResourceUrl(data.signedUrl);
    })
   
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
