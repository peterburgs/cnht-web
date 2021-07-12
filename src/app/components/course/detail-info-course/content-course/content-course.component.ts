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

  @Input() current_course! : Course;
  @Input() fragment: string= "learning";
  firstSectionOrder!:number
  isLoading= true;
  //Example
  courseId:string="";
  listSection: Section[] =[];

  constructor(
    private courseService: CourseService,
    private router: ActivatedRoute
    ) { }

  ngOnInit(): void {
    console.log("INIT CONTENT")
    this.router.params.subscribe(param=>{
      this.courseId=param['courseId']
    })
    if(this.current_course!=undefined){
      this.getListSection();
    }
    
  }

  ngOnChanges(changes:SimpleChanges ):void{
    if(this.courseId!=''){
      this.getListSection();
    }
  }

  //TODO: get list  section of a course
  getListSection(){
    console.log("Current course")
    console.log(this.current_course);
    if(this.current_course!=undefined){
      this.courseService.getSectionByCourseId(this.current_course.id)
      .toPromise().then(data=>{
        this.listSection= data.sections.sort((a,b)=>{return (a.sectionOrder-b.sectionOrder)});
        this.firstSectionOrder= this.listSection[0].sectionOrder;
        console.log(data)
        this.isLoading= false;
      })
      .catch(error=>{
        this.isLoading=false;
        console.log(error)
      })    
    }
    
  }

}
