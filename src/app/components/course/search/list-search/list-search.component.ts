import { Component, Input, OnInit } from '@angular/core';
import { Course } from 'src/app/models/course.model';
import { CourseService } from '../../../../service/course.service';

@Component({
  selector: 'app-list-search',
  templateUrl: './list-search.component.html',
  styleUrls: ['./list-search.component.css']
})
export class ListSearchComponent implements OnInit {

  @Input() listCourseResult: Course[] = [];

  constructor(private CourseService:CourseService) { }

  ngOnInit(): void {
    this.getListCourseResult();
  }

  getListCourseResult(){
    // this.CourseService.getListCourse().subscribe(course => this.listCourseResult = course);
    return this.listCourseResult;
  }

}
