import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Course } from 'src/app/models/course.model';
import { GRADES } from 'src/app/models/grades';
import { ModifyType } from 'src/app/models/ModifyType';
import { VideoType } from 'src/app/models/VideoType.model';
import { ThemePalette } from '@angular/material/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FullCourseService } from '../../../../service/full-course.service';
import { Observable, Subscription } from 'rxjs';
import { FormatPrice } from 'src/app/util/priceformat';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-course-info',
  templateUrl: './course-info.component.html',
  styleUrls: ['./course-info.component.css'],
})
export class CourseInfoComponent implements OnInit {
  @ViewChild('infoCourse', { read: NgForm }) infoCourse!: any;
  @Input() course: Course = new Course();
  baseURL = environment.baseUrl;
  mCourse: Course = new Course();
  imgPath?: Observable<string>;
  selectedValue: string = '';
  priceFormat = '000';
  grades = [
    GRADES.NHSGE,
    GRADES.TWELFTH,
    GRADES.ELEVENTH,
    GRADES.TENTH,
    GRADES.NINTH,
  ];
  loadingCalculate = false;
  loadingSave = false;
  fileToUpLoad: File = new File([], '_Thumbnail');
  tmpImage = '';
  sbcEstimate: Subscription = new Subscription();
  uploadImage = false;
  isPublished = true;
  color: ThemePalette = 'accent';
  constructor(
    private fullCourseService: FullCourseService,
    private _snackBar: MatSnackBar,
    public _DomSanitizationService: DomSanitizer
  ) {}

  ngOnChanges(courseChange: SimpleChanges): void {
    this.priceFormat = String(courseChange.course.currentValue.price);
    this.formatCurrency();
  }
  ngOnInit(): void {
    this.fullCourseService.getSbjCreateCourse().subscribe((course) => {
      this.mCourse = course;
    });
    this.fullCourseService.getLoadingThumbanil().subscribe((isLoading) => {
      if (!isLoading) {
        this.uploadImage = false;
      }
    });
    this.priceFormat = String(this.course.price);
  }
  handleFileInput(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.uploadImage = true;
      this.course.thumbnailUrl = '';
      this.fileToUpLoad = <File>fileList.item(0);

      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.tmpImage = event.target.result;
      };
      let tmpFileName = this.fileToUpLoad.name.replace(/[^\x00-\x7F]/g, '');

      Object.defineProperty(this.fileToUpLoad, 'name', {
        writable: true,
        value: tmpFileName,
      });
      this.fullCourseService.handleUpdateWithThumbnail(this.fileToUpLoad);
      reader.readAsDataURL(this.fileToUpLoad);
    }
  }
  btnDelete() {
    this.fullCourseService.setSelection(
      'default',
      VideoType.course,
      ModifyType.delete
    );
  }

  formatCurrency() {
    this.course.price = parseInt(this.priceFormat.replace(/\D/g, ''));
    let price = this.course.price;
    this.priceFormat = FormatPrice(price, 0, 3, '.', ',');
  }

  formatGrade(grade: GRADES) {
    return grade;
  }
  changeGrade(e: any) {
    this.course.grade = e.target.value;
  }
  onSave(buttonType: string) {
    if (buttonType == 'save') {
      this.loadingSave = true;
      if (this.course.title && this.course.courseDescription) {
        this.fullCourseService.setSelection(
          this.course.id,
          VideoType.course,
          ModifyType.save
        );
        this.fullCourseService
          .onSaveCourse()
          .toPromise()
          .then(
            (response) => {
              this.openSnackBar('All changes saved', 'OK');
              this.loadingSave = false;
            },
            (error) => {
              alert('Cannot save. Please try again');
              this.loadingSave = false;
            }
          );
      }
    }
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  getEstimatePricing() {
    this.loadingCalculate = true;
    this.sbcEstimate = this.fullCourseService
      .getEstimatedCoursePricing()
      .subscribe(
        (response) => {
          this.loadingCalculate = false;
          this.course.price = response.price;
          this.priceFormat = FormatPrice(this.course.price, 0, 3, '.', ',');
        },
        (error) => {
          this.loadingCalculate = false;
        }
      );
  }
  ngOnDestroy(): void {
    this.sbcEstimate.unsubscribe();
  }
  onPublishedCourse($event: any) {
    this.course.isPublished = !this.course.isPublished;
  }
}
