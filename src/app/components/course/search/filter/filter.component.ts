import { Component, Output, OnInit, ViewChild, EventEmitter, Input } from '@angular/core';
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
  "examination solving", "test"];
  @Input() resetFormSubject: boolean = false;
  constructor() { }

  ngOnInit(): void {
    if(this.resetFormSubject){
      this.resetChildForm();
      this.resetFormSubject = false;
    }
  }

show:boolean = true

resetChildForm(){
   this.show = false;

   setTimeout(() => {
      this.show = true
    }, 100);
    console.log("con");
}

  ngAfterViewInit(){
    // this.grade = this.filter.grade;
  }

  receiveGrade($event: any){
    this.grade = $event;
    this.sendGradeChoose.emit(this.grade);
  }

  receiveCategory($event: any){
    this.category = $event;
    this.sendCategoryChoose.emit($event);
  }
 
}
