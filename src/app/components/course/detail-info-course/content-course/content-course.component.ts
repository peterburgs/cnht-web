import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from 'src/app/models/course.model';
import { Section } from 'src/app/models/section.model';
import { CourseService } from 'src/app/service/course.service';
@Component({
  selector: 'app-content-course',
  templateUrl: './content-course.component.html',
  styleUrls: ['./content-course.component.css']
})
export class ContentCourseComponent implements OnInit {

  @Input() current_course = new Course();
  @Input() fragment: string= "learning";

  //Example
  listSection: Section[] =[];

  constructor(
    private courseService: CourseService,
    private router: ActivatedRoute
    ) { }

  ngOnInit(): void {

    this.getListSection();
  }

  //TODO: get list  section of a course
  getListSection(){
    this.listSection=this.courseService.getSectionByCourseId(this.current_course.id);
    console.log(this.listSection)
    // this.courseService.getSectionByCourseId(this.current_course.id).subscribe(sections=>
    //    this.listSection= sections
    //   )
  }

}
