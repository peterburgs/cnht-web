import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
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
        .subscribe(responseData=> this.learner= responseData.users[0])
    }
    else{
      this.route.navigate(['/login'] )
    }
    
    this.getMyCourses();
  }

  getMyCourses(){ 
    //this.userService.getUserInLocalStore().subscribe(user=>this.learner= user)
    //.courseService.getMyCourses(this.learner.id)
    
  }

  searchCourse(input:string){
    console.log(input);
    this.searchedCourses =this.myCourseList.filter(course=> course.title.toLowerCase().includes(input.toLowerCase()) ); 
  }

}
