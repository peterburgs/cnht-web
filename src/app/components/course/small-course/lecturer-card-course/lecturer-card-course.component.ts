import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Course } from 'src/app/models/course.model';
import { FullCourseService } from 'src/app/service/full-course.service';

@Component({
  selector: 'app-lecturer-card-course',
  templateUrl: './lecturer-card-course.component.html',
  styleUrls: ['./lecturer-card-course.component.css']
})
export class LecturerCardCourseComponent implements OnInit {
  @Input() course= new Course();
  @Input() isLearner: boolean=false;
  baseUrl='https://us-central1-supple-craft-318515.cloudfunctions.net/app';
  constructor(private route:ActivatedRoute,
    private router:Router, private fullCourseService: FullCourseService) { }

  ngOnInit(): void {
    
  }
  onEditCourse(idItem:string){
   // this.router.navigate(['edit'],{relativeTo:this.route})
    // this.fullCourseService.getDataServe();
   const promise= new Promise((resolve, reject)=>{
    setTimeout(()=>{
      this.router.navigate(['../','course',idItem], {relativeTo:this.route}) },1500)
    });
   // this.router.navigate(['../','course',idItem],{relativeTo:this.route})
  }

}
