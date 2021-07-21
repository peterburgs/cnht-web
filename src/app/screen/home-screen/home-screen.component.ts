import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { COURSE_TYPE } from 'src/app/models/course-type';
import { GRADES } from 'src/app/models/grades';
import { authenticationService } from 'src/app/service/authentication.service';

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
  activeButton: number=1;
  constructor(private authenService: authenticationService,
    private router: Router,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {   
    
  }

  changeCourseType(number:number){
    if(number==1){
      this.course_type= COURSE_TYPE.THEORY
      this.activeButton=number;
    }
    if(number==2){
      this.course_type= COURSE_TYPE.EXAMINATION_SOLVING;
      this.activeButton=number;
    }
  }

  testType(){
    alert("This feature is being developed.")
  }


  openSnackBar(message: string, action: string) { // notice success
    this._snackBar.open(message, action, {
      duration: 2000
    });
  }

}

