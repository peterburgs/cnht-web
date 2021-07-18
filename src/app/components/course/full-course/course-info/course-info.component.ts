import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { COURSE_TYPE } from 'src/app/models/course-type';
import { Course } from 'src/app/models/course.model';
import { GRADES } from 'src/app/models/grades';
import { ModifyType } from 'src/app/models/ModifyType';
import { VideoType } from 'src/app/models/VideoType.model';

import { FullCourseService } from '../../../../service/full-course.service';
import { Observable, Subscription } from 'rxjs';
import { FormatPrice } from 'src/app/util/priceformat';
@Component({
  selector: 'app-course-info',
  templateUrl: './course-info.component.html',
  styleUrls: ['./course-info.component.css'],
})
export class CourseInfoComponent implements OnInit {
  @ViewChild('infoCourse', { read: NgForm }) infoCourse!: any;
  @Input() course: Course = new Course();
  baseURL = 'https://us-central1-supple-craft-318515.cloudfunctions.net/app';
  mCourse: Course = new Course();
  imgPath?: Observable<string>;
  selectedValue: string = '';
  priceFormat = '000';
  types = [COURSE_TYPE.THEORY, COURSE_TYPE.EXAMINATION_SOLVING
    , COURSE_TYPE.TEST];
  grades = [GRADES.TWELFTH, GRADES.ELEVENTH, GRADES.TENTH];
  loadingCalculate=false;
  fileToUpLoad: File = new File([], '_Thumbnail');
    tmpImage="";
  sbcEstimate:Subscription = new Subscription();

  isPublished=true;
  constructor(private fullCourseService: FullCourseService) {}

  ngOnChanges(courseChange: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.priceFormat = String(courseChange.course.currentValue.price);
    this.formatCurrency();
    
  }
  ngOnInit(): void {
    this.fullCourseService.getSbjCreateCourse().subscribe((course) => {
      this.mCourse = course;
    });

    this.priceFormat = String(this.course.price);
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
        // this.course.thumbnailUrl = event.target.value;
        // console.log(event.target.result);
        this.tmpImage=event.target.result;
      };
      this.fullCourseService.handleUpdateWithThumbnail(this.fileToUpLoad);
      reader.readAsDataURL(this.fileToUpLoad);
    }
  }
  btnDelete() {
    // this.validateInput();
    this.fullCourseService.setSelection(
      'default',
      VideoType.course,
      ModifyType.delete
    );
    this.fullCourseService.onNotifyContent();
  }

  formatCurrency() {
    this.course.price = parseInt(this.priceFormat.replace(/\D/g, ''));
    let price = this.course.price;
    this.priceFormat = FormatPrice(price, 0, 3, '.', ',');
  }
  formatType(type: COURSE_TYPE) {
    return type;
  }
  formatGrade(grade: GRADES) {
    return grade;
  }
  changeType(e: any) {
    this.course.courseType = e.target.value;
  }
  changeGrade(e: any) {
    this.course.grade = e.target.value;
  }
  onSave() {
    this.fullCourseService.setSelection(
      this.course.id,
      VideoType.course,
      ModifyType.save
    );
    this.fullCourseService
      .onSaveCourse()
      .toPromise()
      .then(
        (response) => {},
        (error) => {
          alert('Server error!!! try again');
        }
      );
  }
  getEstimatePricing(){
    this.loadingCalculate=true;
    this.sbcEstimate = this.fullCourseService.getEstimatedCoursePricing()
      .subscribe(response=>{
        this.loadingCalculate=false;
        this.course.price= response.price;
        this.priceFormat= FormatPrice(this.course.price, 0, 3, '.', ',');
      })
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.sbcEstimate.unsubscribe();
  }
  onPublishedCourse($event:any){
      // Handle update Publish
      this.course.isPublished= !this.course.isPublished;
  }
}
