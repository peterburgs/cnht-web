import { Component, OnInit } from '@angular/core';
import { COURSE_TYPE } from 'src/app/models/course-type';
import { GRADES } from 'src/app/models/grades';

@Component({
  selector: 'app-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrls: ['./home-screen.component.css']
})
export class HomeScreenComponent implements OnInit {

  grade10:GRADES =GRADES.TENTH;
  grade11:GRADES= GRADES.ELEVENTH;
  grade12:GRADES= GRADES.TWELFTH;
  course_type:COURSE_TYPE= COURSE_TYPE.THEORY;
  constructor() { }

  ngOnInit(): void {   
  }

  changeCourseType(number:number){
    if(number==1){
      this.course_type= COURSE_TYPE.THEORY
      console.log("1")
    }
    if(number==2){
      this.course_type= COURSE_TYPE.EXAMINATION_SOLVING;
      console.log("2")

    }
  }

}
