import { Component, Input, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Form, NgForm } from '@angular/forms';
import { COURSE_TYPE } from 'src/app/models/course-type';
import { Course } from 'src/app/models/course.model';
import { GRADES } from 'src/app/models/grades';
import { ModifyType } from 'src/app/models/ModifyType';
import { VideoType } from 'src/app/models/VideoType.model';
import { CourseService } from 'src/app/service/course.service';
import { EventEmitter} from '@angular/core'
import { FullCourseService } from '../full-course.service';
@Component({
  selector: 'app-course-info',
  templateUrl: './course-info.component.html',
  styleUrls: ['./course-info.component.css'],
})
export class CourseInfoComponent implements OnInit {
  @ViewChild('infoCourse', { read: NgForm }) infoCourse!: any;
  @Input() course :Course= {
    id: '',
    title: '',
    courseDescription: '',
    price: 0,
    courseType: COURSE_TYPE.THEORY,
    grade: GRADES.TWELFTH,
    thumbnailUrl:
      'https://images.unsplash.com/photo-1613905780946-26b73b6f6e11?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1052&q=80',
    createdAt: new Date(),
    updatedAt: new Date(),
    isHidden: false,
  };
  selectedValue:string='';
  priceFormat = '000';
  types = [
    COURSE_TYPE.THEORY,
    COURSE_TYPE.EXAMINATION_SOLVING,
    
  ];
  grades=[
    GRADES.TWELFTH,
    GRADES.ELEVENTH,
    GRADES.TENTH
  ]
 
  fileToUpLoad: File = new File([], 'hinh-a');
  constructor(private fullCourseService: FullCourseService) {}

  ngOnInit(): void {
    if (this.fullCourseService.subsValid == null) {
      this.fullCourseService.subsValid =
        this.fullCourseService.invokeValidModal.subscribe(() => {
          this.validateInput();
        });
    }
  }
  handleFileInput(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      console.log('FileUpload -> files', fileList);

      this.fileToUpLoad = <File>fileList.item(0);
      var reader = new FileReader();
      //update Image to UI
      reader.onload = (event: any) => {
        this.course.thumbnailUrl = event.target.result;
      };
      reader.readAsDataURL(this.fileToUpLoad);
    }
  }
  btnDelete() {
    this.validateInput();
    this.fullCourseService.setSelection(
      'default',
      VideoType.course,
      ModifyType.delete
    );
    this.fullCourseService.onNotifyContent();
  }

  validateInput() {
    this.fullCourseService.setCourse(this.course);

    if(this.course.title  && this.course.courseDescription ){
       this.fullCourseService.setIsValid(true);
    }
      else{
      this.fullCourseService.setIsValid(false);}
    //this.fullCourseService.setIsValid(this.infoCourse.valid);
  }
  formatCurrency() {
    while (this.priceFormat.charAt(0) === '0') {
      this.priceFormat = this.priceFormat.substring(1);
    }
    this.course.price=parseInt(this.priceFormat.replace(/\D/g, ''));
    this.priceFormat = this.priceFormat
      .replace(/\D/g, '')
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    console.log(this.priceFormat);
  }
  formatType(type:COURSE_TYPE){
    return type; 
  }
  formatGrade(grade:GRADES){
    return grade;
  }
  changeType(e:any) {
    this.course.courseType= e.target.value;
  }
  changeGrade(e:any){
    this.course.grade= e.target.value;
  
  }
}
