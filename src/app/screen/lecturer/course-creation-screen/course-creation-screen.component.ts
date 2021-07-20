import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FullCourseService } from 'src/app/service/full-course.service';
import { ElementRef, ViewChild } from '@angular/core';

import { VideoType } from 'src/app/models/VideoType.model';
import { ModifyType } from 'src/app/models/ModifyType';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SectionDummy } from 'src/app/models/sectionDummy.model';

import { authenticationService } from 'src/app/service/authentication.service';
import { Course } from 'src/app/models/course.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable, Subscription } from 'rxjs';
import { CanComponentDeactivate } from './can-deactive-guard.service';
import { ModalServiceService } from 'src/app/service/modal-service.service';

@Component({
  selector: 'app-course-creation-screen',
  templateUrl: './course-creation-screen.component.html',
  styleUrls: ['./course-creation-screen.component.css'],
})
export class CourseCreationScreenComponent
  implements OnInit, CanComponentDeactivate
{
  @ViewChild('content', { static: true }) content?: ElementRef;
  @ViewChild('error_happen', { static: true }) error_happen?: ElementRef;
  @ViewChild('file', { static: false }) fileVideo?: ElementRef;
  arrLoading: boolean[] = [];
  sections: SectionDummy[] = [];
  videoURL: SafeUrl = '';
  maxLecture: number = 1;
  wayModify: ModifyType = ModifyType.edit;

  typeSelection = VideoType.lecture;
  urlVideo?: string = '../';

  idCourse: string = 'default';
  titleBinding = '';
  course: Course = new Course();
  isLoading = true;
  duration = 0;
  errorMessage = 'Server error. Try again!!!';
  isLeaving = false;

  scbSectionDummy: Subscription = new Subscription();
  scbFinish: Subscription = new Subscription();
  sbcInit: Subscription = new Subscription();
  sbcType: Subscription = new Subscription();
  sbcWay: Subscription = new Subscription();
  sbcUploadMedia: Subscription = new Subscription();
  sbcLeaving: Subscription = new Subscription();
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private fullCourseService: FullCourseService,
    private authService: authenticationService,
    private sanitizer: DomSanitizer,
    private customiseModalService: ModalServiceService
  ) {}
  /**
   * Open dialog confirm handle (delete, create,...)
   */
  openVerticallyCentered() {
    this.titleBinding = this.fullCourseService.getTitleContent();
    this.titleBinding = '';
    this.modalService.open(this.content, { centered: true });
  }
  /**
   * Open error dialog
   */
  openNotifyError() {
    this.modalService.open(this.error_happen, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });
  }
  ngOnInit(): void {
    this.isLoading = true;
    //this.fullCourseService.getData();
    if (this.authService.isAdmin()) {
      //check admin login
      this.route.params.subscribe((params: Params) => {
        this.idCourse = params['id'];
        if (!this.idCourse) {
          this.router.navigateByUrl('/admin/home').then();
        }
        this.fullCourseService.setIdCourse(this.idCourse);
      });
      
      //Section dummy get all value need (sections, lectures...)
      this.scbSectionDummy = this.fullCourseService
        .getSbjSectionDummy()
        .subscribe((dummy) => {
          this.isLoading = false;
          this.arrLoading = this.fullCourseService.getArrayLoading();
          this.maxLecture = this.fullCourseService.getMaxLenLecture();
          this.sections = this.fullCourseService.getSectionDummy();
        });
        
      this.sbcLeaving = this.customiseModalService
        .getObserveLeave()
        .subscribe((isLeaving) => {
          this.isLeaving = isLeaving;
        });
      this.scbFinish = this.fullCourseService
        .getSbjIsFinish()
        .subscribe((status) => {
          if (status == 200) {
            this.modalService.dismissAll();
            this.isLoading = false;
            window.location.reload();
          } else if (status == 500) {
            this.modalService.dismissAll();
            this.isLoading = false;
            this.errorMessage = this.fullCourseService.getErrorMessage();
            this.openNotifyError();
            // alert(this.fullCourseService.getErrorMessage());

            window.location.reload();
          } else if (status == 201) {
            this.isLoading = false;
            this.modalService.dismissAll();
          }
        });
      this.sbcUploadMedia = this.fullCourseService
        .getSbjUploadMediaState()
        .subscribe((state) => {
          if (!state) {
            this.errorMessage = "Can't finish your uploading!!!";
            this.openNotifyError();
            window.location.reload();
          }
        });
      //Update course in fullService

      this.sbcInit = this.fullCourseService.initCourses().subscribe(
        (response) => {
          this.fullCourseService.setCourses(response.courses);
          this.fullCourseService.setIdCourseSelection(this.idCourse);
          this.fullCourseService.setCourseSelection();
          this.course = this.fullCourseService.getCourseInfo();
        },
        (error) => {
          console.log(error);
        }
      );
      this.sbcType = this.fullCourseService
        .getCurrentSelection()
        .subscribe((type) => {
          this.typeSelection = type;
        });
      this.sbcWay = this.fullCourseService.getWayModify().subscribe((way) => {
        this.wayModify = way;
      });
      //Set observable to show dialog
      if (this.fullCourseService.subsEdit == null) {
        this.fullCourseService.subsEdit =
          this.fullCourseService.invokeNotifyModal.subscribe((content: any) => {
            this.openVerticallyCentered();
          });
      }
      this.fullCourseService.getData();
    }
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

    this.scbSectionDummy.unsubscribe();
    this.scbFinish.unsubscribe();
    this.sbcInit.unsubscribe();
    this.sbcType.unsubscribe();
    this.sbcWay.unsubscribe();
    this.sbcLeaving.unsubscribe();
    this.sbcInit.unsubscribe();
  }
  onCreateSection() {
    this.fullCourseService.setSelection(
      this.course.id,
      VideoType.section,
      ModifyType.new
    );
    this.openVerticallyCentered();
  }
  //Customise title in model confirmation
  customeTitle() {
    let title = '';

    switch (this.wayModify) {
      case ModifyType.edit:
        title = 'Edit ';
        break;
      case ModifyType.delete:
        title = 'Delete ';
        break;
      case ModifyType.new:
        title = 'Create ';
        break;
      case ModifyType.errorValid:
        title = 'Error input ';
        break;
      case ModifyType.leave:
        title = 'Info ';
        break;
      case ModifyType.goUp:
        title = 'Up ';
        break;
      case ModifyType.goDown:
        title = 'Down ';
        break;
      default:
        title = 'Save ';
    }
    if (this.typeSelection == VideoType.course) {
      title += 'course';
    } else if (this.typeSelection == VideoType.section) {
      title += 'section';
    } else {
      title += 'lecture';
    }
    return title;
  }
  //Customise content notify to user
  customeContent() {
    const confirmMessage = 'Are you sure ';
    const createMessage = 'Save successful!!!';
    const validMessage = 'Input invalid!!!';
    const noticeMessage = 'Your working not save!!!';

    switch (this.wayModify) {
      case ModifyType.delete:
        if (this.typeSelection == VideoType.course)
          return confirmMessage + 'delete this course?';
        else if (this.typeSelection == VideoType.section)
          return confirmMessage + 'delete this section?';
        return confirmMessage + 'delete this lecture?';
      case ModifyType.save:
        return createMessage;
      case ModifyType.errorValid:
        return validMessage;
      case ModifyType.leave:
        return noticeMessage;
      case ModifyType.goUp:
        if (this.typeSelection == VideoType.lecture)
          return confirmMessage + 'move this lecture up?';
        return confirmMessage + ' move this section up?';
      case ModifyType.goDown:
        if (this.typeSelection == VideoType.section) {
          return confirmMessage + ' move this section down?';
        }
        return confirmMessage + ' move this lecture down?';
    }
    return '';
  }
  //Handle action user confirm
  onConfirmSave() {
    this.isLoading = true;
    console.log('*** Type modify and Way Modify');
    console.log(this.typeSelection + ' : ' + this.wayModify);

    if (this.typeSelection == VideoType.section) {
      if (this.wayModify == ModifyType.new) {
        if (!this.titleBinding) {
          return;
        }
        this.fullCourseService.handleCreateSection(this.titleBinding);
      } else if (this.wayModify == ModifyType.delete) {
        this.fullCourseService.onDeleteSection();
      } else if (this.wayModify == ModifyType.goUp) {
        this.fullCourseService.onUpSection();
      } else if (this.wayModify == ModifyType.goDown) {
        this.fullCourseService.onDownSection();
      }
    } else if (this.typeSelection == VideoType.lecture) {
      if (this.wayModify == ModifyType.new) {
        if (!this.titleBinding) {
          return;
        }
        this.fullCourseService.handleCreateLecture(this.titleBinding);
      } else if (this.wayModify == ModifyType.edit) {
      } else if (this.wayModify == ModifyType.delete) {
        this.fullCourseService.onDeleteLecture();
      } else if (this.wayModify == ModifyType.goUp) {
        this.fullCourseService.onUpLecture();
      } else if (this.wayModify == ModifyType.goDown) {
        this.fullCourseService.onDownLecture();
      }
    } else if (
      this.fullCourseService.wayModify == ModifyType.delete &&
      this.fullCourseService.typeSelection == VideoType.course
    ) {
      this.fullCourseService.onDeleteCourse().subscribe(
        (response) => {
          this.router.navigateByUrl('/admin/home').then();
          this.modalService.dismissAll();
        },
        (error) => {
          this.modalService.dismissAll();
          console.log(console.error());
          alert('Error happen!!! try again');
          window.location.reload();
        }
      );
    }
  }
  goBack() {
    this.router.navigateByUrl('/admin/home').then();
  }
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    //Active back
    this.isLeaving = true;
    this.customiseModalService.getObserveLeave().subscribe((leaving) => {
      this.isLeaving = false;
      console.log(leaving);
    });
    if (this.idCourse) {
      return this.customiseModalService.naviagateAwaySelection$;
    } else {
      return true;
    }
  }
}
