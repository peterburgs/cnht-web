import { Component, OnInit } from '@angular/core';
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
  constructor() { }

  ngOnInit(): void {

    
    
  }

}
