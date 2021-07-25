import { Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import { COURSE_TYPE } from 'src/app/models/course-type';
import { GRADES } from 'src/app/models/grades';

interface type_course {
  value: COURSE_TYPE;
  view: string;
}
@Component({
  selector: 'app-course-filter',
  templateUrl: './course-filter.component.html',
  styleUrls: ['./course-filter.component.css']
})
export class CourseFilterComponent implements OnInit {

  @Output() sendGradeChoose = new EventEmitter<string>();
  @Output() sendCategoryChoose = new EventEmitter<string>();
  panelOpenState = false;
  constructor() { }

  ngOnInit(): void {
  }

  listFilter: type_course[] = [
    { value: COURSE_TYPE.THEORY, view: "Theory"},
    { value: COURSE_TYPE.EXAMINATION_SOLVING, view: "Examination Solving"},
    { value: COURSE_TYPE.TEST, view: "Test"}];

  listGrade = [GRADES.TWELFTH, GRADES.ELEVENTH, GRADES.TENTH, GRADES.NINE];

  @Input() gradeSelected = "";
  typeSelected = COURSE_TYPE.THEORY;
  close(){
    this.panelOpenState = false;
    this.gradeSelected = "";
  }

  open(type: COURSE_TYPE){
    this.panelOpenState = true;
    this.typeSelected = type
    }

    changeSelectedGrade(grade: GRADES){
      this.gradeSelected = grade;
      this.sendGradeChoose.emit(this.gradeSelected);
      this.sendCategoryChoose.emit(this.typeSelected);   
    }

}
