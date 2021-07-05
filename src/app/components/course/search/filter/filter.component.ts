import { Component, Output, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { CategoryFilter } from 'src/app/models/categoryFilter';
import { COURSE_TYPE } from 'src/app/models/course-type';
import { GRADES } from 'src/app/models/grades';
import { ItemFilterComponent } from './item-filter/item-filter.component';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {


  @ViewChild(ItemFilterComponent) filter: any;
  @Output() sendGradeChoose = new EventEmitter<string>();
  @Output() sendCategoryChoose = new EventEmitter<string>();
  grade: string = GRADES.TWELFTH;
  category: string = COURSE_TYPE.THEORY;
  listFilter = ["theory", 
  "examination solving",];
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    // this.grade = this.filter.grade;
  }

  receiveGrade($event: any){
    this.grade = $event;
    console.log("qua con:" + this.grade);
    this.sendGradeChoose.emit(this.grade);
  }

  receiveCategory($event: any){
    this.category = $event;
    console.log("qua con:" + this.category);
    this.sendCategoryChoose.emit($event);
  }
 
}
