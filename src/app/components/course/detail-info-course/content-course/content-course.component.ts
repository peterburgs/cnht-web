import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Course } from 'src/app/models/course.model';
import { Section } from 'src/app/models/section.model';
import { CourseService } from 'src/app/service/course.service';
@Component({
  selector: 'app-content-course',
  templateUrl: './content-course.component.html',
  styleUrls: ['./content-course.component.css']
})
export class ContentCourseComponent implements OnInit , OnChanges{

  @Input() current_course = new Course();
  @Input() fragment: string= "learning";
  firstSectionOrder!:number
  isLoading= true;
  //Example
  listSection: Section[] =[];

  constructor(
    private courseService: CourseService,
    private router: ActivatedRoute
    ) { }

  ngOnInit(): void {

    this.getListSection();
  }

  ngOnChanges(changes:SimpleChanges ):void{
    if(changes.current_course)
      this.ngOnInit()
  }

  //TODO: get list  section of a course
  getListSection(){
    console.log("Current course")
    console.log(this.current_course);
    this.courseService.getSectionByCourseId(this.current_course.id)
    .pipe(
      catchError((error)=>{
          console.log(error)
          this.isLoading= false;
         return throwError(error)
          
      })
    )
    .subscribe(data=>{
      this.listSection= data.sections.sort((a,b)=>{return (a.sectionOrder-b.sectionOrder)});
      this.firstSectionOrder= this.listSection[0].sectionOrder;
      console.log(data)
      this.isLoading= false;
    })
    
  }

}
