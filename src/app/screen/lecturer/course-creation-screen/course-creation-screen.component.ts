import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FullCourseService } from 'src/app/service/full-course.service';
import { Upload } from 'src/app/models/file-upload';
import { ElementRef, ViewChild } from '@angular/core';
import { Section } from 'src/app/models/section.model';
import { Lession } from 'src/app/models/lession.model';
import { VideoType } from 'src/app/models/VideoType.model';
import { ModifyType } from 'src/app/models/ModifyType';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Video } from 'src/app/models/video.model';
import { SectionDummy } from 'src/app/models/sectionDummy.model';

import { NgForm } from '@angular/forms';
import { authenticationService } from 'src/app/service/authentication.service';
import { Course } from 'src/app/models/course.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-course-creation-screen',
  templateUrl: './course-creation-screen.component.html',
  styleUrls: ['./course-creation-screen.component.css'],
})
export class CourseCreationScreenComponent implements OnInit {
  @ViewChild('content', { static: true }) content?: ElementRef;
  @ViewChild('error_happen', { static: true }) error_happen?: ElementRef;
  // @ViewChild('nameTitle', { read: NgForm  }) nameTitle?: ElementRef;
  @ViewChild('file', { static: false }) fileVideo?: ElementRef;
  arrLoading:boolean[]=[];
  sections: SectionDummy[] = [];
  videoURL: SafeUrl='';

  wayModify: ModifyType = ModifyType.edit;
  sectionCurrent = new Section();
  lessionCurrent = new Lession('', '');
  typeSelection = VideoType.lession;
  fileToUpLoad: File = new File([], 'hinh-a');
  urlVideo?: string = '../';
  isValid = true;
  idCourse: string = 'default';
  titleBinding = '';
  loadingSpinner = false;
  isNotify = false;
  course: Course = new Course();
  isLoading = true;
  duration=0;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private fullCourseService: FullCourseService,
    private authService: authenticationService,
    private sanitizer: DomSanitizer,
   
  ) {}
  handleFileInput(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      console.log('FileUpload -> files', fileList);

      this.fileToUpLoad = <File>fileList.item(0);
      var reader = new FileReader();

      //update Image to UI
      reader.onload = (event: any) => {
        this.urlVideo = this.fileToUpLoad.name;
      };
      this.urlVideo = fileList.item(0)?.name;
      reader.readAsDataURL(this.fileToUpLoad);
    }
  }
  openVerticallyCentered() {
    this.titleBinding = this.fullCourseService.getTitleContent();
    if (
      this.typeSelection == VideoType.course &&
      (this.wayModify == ModifyType.save ||
        this.wayModify == ModifyType.errorValid)
    ) {
      this.isNotify = true;
    } else {
      this.isNotify = false;
    }
    this.titleBinding='';
    this.fileToUpLoad= new File([], 'default')
    this.urlVideo='';
    this.modalService.open(this.content, { centered: true, size: 'lg' });
  }
  openNotifyError() {
    this.modalService.open(this.error_happen, { centered: true });
  }
  ngOnInit(): void {
    this.isLoading = true;
    // this.fullCourseService.getDataServe();

    if (this.authService.isAdmin()) {
      //check admin login
      this.route.params.subscribe((params: Params) => {
        this.idCourse = params['id'];
        this.fullCourseService.setIdCourse(this.idCourse);
        console.log(this.idCourse);
        if (params['id'] == null) {
          this.idCourse = 'default';
        }
      });
  
      this.fullCourseService.getSbjSectionDummy().subscribe((dummy) => {

        this.isLoading = false;
        this.arrLoading= this.fullCourseService.getArrayLoading();
      });
      this.fullCourseService.getSbjIsFinish().subscribe(status=>{
        if(status== 200){
          this.modalService.dismissAll();
          this.isLoading=false;
          // //refresh
           window.location.reload();
        }
        else if (status == 404){
          //
          //refresh
          this.modalService.dismissAll();
          this.isLoading=false;
          alert("Problem having, try again")
          // //refresh
           window.location.reload();
        }
        
      })
      //Update course in fullService

      this.fullCourseService.initCourses().subscribe((response) => {
     
        console.log(response.courses);
        this.fullCourseService.setCourses(response.courses);
        this.fullCourseService.setIdCourseSelection(this.idCourse);
        this.fullCourseService.setCourseSelection();
        this.course = this.fullCourseService.getCourseInfo();
      }, error=>{
        console.log(error);
      });
      this.fullCourseService.getData();

      //TODO: check is observ able or not
      this.sections = this.fullCourseService.getSectionDummy();
      this.fullCourseService.getCurrentSelection().subscribe((type) => {
        this.typeSelection = type;
      });
      this.fullCourseService.getWayModify().subscribe((way) => {
        this.wayModify = way;
      });

      if (this.fullCourseService.subsEdit == null) {
        this.fullCourseService.subsEdit =
          this.fullCourseService.invokeNotifyModal.subscribe((content: any) => {
            this.openVerticallyCentered();
          });
      }
    }
  }

  onCreateSection() {
    this.fullCourseService.setSelection(
      'default',
      VideoType.section,
      ModifyType.new
    );
    this.openVerticallyCentered();
  }
  customeTitle() {
    switch (this.wayModify) {
      case ModifyType.edit:
        return 'Edit';
      case ModifyType.delete:
        return 'Delete';
      case ModifyType.new:
        return 'Create';
      case ModifyType.errorValid:
        return 'Error input';
      case ModifyType.leave:
        return 'Info';
      case ModifyType.goUp:
        return 'Up';
      case ModifyType.goDown:
        return 'Down';
    }
    return 'Save';
  }
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
        return confirmMessage + 'delete this lession?';
      case ModifyType.save:
        return createMessage;
      case ModifyType.errorValid:
        return validMessage;
      case ModifyType.leave:
        return noticeMessage;
      case ModifyType.goUp:
        if (this.typeSelection == VideoType.lession)
          return confirmMessage + ' up level this lession?';
        return confirmMessage + ' up level this section?';
      case ModifyType.goDown:
        if (this.typeSelection == VideoType.section) {
          return confirmMessage + ' down level this section?';
        }
        return confirmMessage + ' down level this lession?';
    }
    return '';
  }

  onConfirmSave() {
    this.isLoading=true;
    console.log(this.typeSelection);
    if (this.typeSelection == VideoType.section) {
      if (this.wayModify == ModifyType.new) {
        if(!this.titleBinding){
          return;
        }
        this.fullCourseService.handleCreateSection(this.titleBinding).subscribe(
          (response) => {
            console.log(response);
            if (response.count > 0) {
              this.modalService.dismissAll();
              this.isLoading = false;
              window.location.reload();
            } else {
              alert('Error happen, please try again');
            }
          },
          (error) => {
            this.modalService.dismissAll();
            console.log(console.error());
            alert("Error happen!!! try again")
          }
        );
      } else if (this.wayModify == ModifyType.delete) {
        this.fullCourseService.onDeleteSection().subscribe(
          (response) => {
            if (response.message == 'Delete section successfully') {
              this.isLoading = false;
              this.modalService.dismissAll();
              window.location.reload();
            } else {
              alert('Error happen, please try again');
              window.location.reload();
            }
          },
          (error) => {
            this.modalService.dismissAll();
            alert("Error happen!!! try again")
          }
        );
      } else if (this.wayModify == ModifyType.goUp) {
        this.fullCourseService.onUpSection()?.subscribe(
          (response) => {
            this.isLoading = false;
            this.modalService.dismissAll();
            window.location.reload();
          },
          (error) => {
            this.modalService.dismissAll();
            console.log(error);
            this.isLoading=false;
            alert("Error happen!!! try again")
          }
        );
      } else if (this.wayModify == ModifyType.goDown) {
        this.fullCourseService.onDownSection()?.subscribe(
          (response) => {
            this.modalService.dismissAll();
            this.isLoading=false;
            window.location.reload();
          },
          (error) => {
            console.log(error.message);
            this.modalService.dismissAll();
            alert("Error happen!!! try again")
          }
        );
      }
    } else if (this.typeSelection == VideoType.lession)
    {
      if (this.wayModify == ModifyType.new) 
      {
        if(!this.titleBinding){
            return;
        }
        this.fullCourseService
          .handleCreateLecture(this.titleBinding)?.subscribe(
            response => {
              console.log(response);
              if (response && response.count < 0) {
                alert('Error happen, please try again');
              } else {
                this.isLoading = false;
                this.modalService.dismissAll();
                window.location.reload();
              }
            }
          , error=>{
            this.modalService.dismissAll();
            console.log(console.error());
            
            alert("Error happen!!! try again")
          }
          )
      } else if (this.wayModify == ModifyType.edit) {
        // if(this.fileToUpLoad.name != "default"){
        //   console.log(this.fileToUpLoad.stream.length);
        //   this.fullCourseService.handleUpdateWithVideo(this.fileToUpLoad, this.duration);
        // }
      } else if (this.wayModify == ModifyType.delete) {
        this.fullCourseService.onDeleteLecture().subscribe(
          (response) => {
            this.isLoading=false;
            if (response.message == 'Delete lecture successfully') {
              this.modalService.dismissAll();
              window.location.reload();
            } else {
              this.modalService.dismissAll();
              alert("Error happen!!! try again")
            }
          },
          (error) => {
            console.log(console.error());
            this.modalService.dismissAll();
            alert("Error happen!!! try again")
            
          })
        
      } else if (this.wayModify == ModifyType.goUp) {
        //this.fullCourseService.onUpLecture();
        this.fullCourseService.onUpLecture();
      } else if (this.wayModify == ModifyType.goDown) {
        this.fullCourseService.onDownLecture();
      }
    } else if (
        this.fullCourseService.wayModify == ModifyType.delete &&
        this.fullCourseService.typeSelection == VideoType.course
      ) 
    {
        this.fullCourseService.onDeleteCourse().subscribe(
          (response) => {
              this.router.navigateByUrl('/admin/home').then();
              this.modalService.dismissAll();
          },
          (error) => {
            this.modalService.dismissAll();
            console.log(console.error());
            alert("Error happen!!! try again")
          }
        );
      }
  }
  goBack() {
    this.router.navigateByUrl('/admin/home').then();
  }
  
}
