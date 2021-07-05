import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FullCourseService } from 'src/app/components/course/full-course/full-course.service';
import { Upload } from 'src/app/models/file-upload';
import { ElementRef, ViewChild } from '@angular/core';
import { Section } from 'src/app/models/section.model';
import { Lession } from 'src/app/models/lession.model';
import { VideoType } from 'src/app/models/VideoType.model';
import { ModifyType } from 'src/app/models/ModifyType';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Video } from 'src/app/models/video.model';
import { SectionDummy } from 'src/app/models/sectionDummy.model';

import {  NgForm } from '@angular/forms';

@Component({
  selector: 'app-course-creation-screen',
  templateUrl: './course-creation-screen.component.html',
  styleUrls: ['./course-creation-screen.component.css'],
})
export class CourseCreationScreenComponent implements OnInit {
  @ViewChild('content', { static: true }) content?: ElementRef;
  // @ViewChild('nameTitle', { read: NgForm  }) nameTitle?: ElementRef;
  sections: SectionDummy[] = [];
  editMode=false;
  wayModify:ModifyType=ModifyType.edit;
  sectionCurrent= new Section();
  lessionCurrent= new Lession("","");
  typeSelection= VideoType.lession;
  fileToUpLoad: File = new File([], 'hinh-a');
  urlVideo?:string = '../';
  isValid=true;
  idCourse:string='default'
  titleBinding='';
  loadingSpinner=false;
  isNotify=false;
  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private modalService: NgbModal,
    private fullCourseService: FullCourseService
   
    ) {
  
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
        this.urlVideo = event.target.result;
      };
         this.urlVideo=fileList.item(0)?.name;
       reader.readAsDataURL(this.fileToUpLoad);
    }
  }


  openVerticallyCentered() {  
    this.titleBinding=this.fullCourseService.getTitleContent();
    if(this.typeSelection==VideoType.course && ( this.wayModify==ModifyType.save || this.wayModify== ModifyType.errorValid)){
      this.isNotify=true;
    }
    else
    {
      this.isNotify=false;
    }
    this.modalService.open(this.content, { centered: true, size:'lg' });
  }

  ngOnInit(): void {

    this.route.params.subscribe((params:Params)=>{
      this.idCourse= params['id'];
      if(params['id']==null){
        this.idCourse='default';
      }
      
      this.editMode= params['id'] != null;
          
    })
    this.fullCourseService.setCourseSelection(this.idCourse);
    this.fullCourseService.getDataServe();
    //TODO: check is observable or not
     this.sections= this.fullCourseService.getSectionDummy();
    this.fullCourseService.getCurrentSelection().subscribe(type=>{
          this.typeSelection= type;
         
    })
    this.fullCourseService.getWayModify().subscribe(way=>{
      this.wayModify= way;
    })

    if (this.fullCourseService.subsEdit == null) {
      this.fullCourseService.subsEdit =
        this.fullCourseService.invokeNotifyModal.subscribe((content: any) => {
          this.openVerticallyCentered();
        });
    }
   
      
  }
  onSave(){
    this.fullCourseService.onValidateInput();
    this.isValid=this.fullCourseService.getValidate();
    console.log(this.isValid);
    if(this.isValid){
        //Check condition here
    this.fullCourseService.setSelection(this.idCourse, VideoType.course, ModifyType.save);
    this.fullCourseService.handleUpate();
    }
    else{
      this.fullCourseService.setSelection('default', VideoType.course, ModifyType.errorValid);
    }
    
    this.openVerticallyCentered();

  }
  onCreateSection(){
    this.fullCourseService.setSelection('default',VideoType.section, ModifyType.new);
    this.openVerticallyCentered();
  }
  customeTitle(){
      switch(this.wayModify){
        case ModifyType.edit:
          return 'Edit';
        case ModifyType.delete:
          return 'Delete';
        case ModifyType.new:
          return 'Create';
        case ModifyType.errorValid:
          return 'Error input';
        case ModifyType.leave:
          return 'Info'
        case ModifyType.goUp:
          return 'Up'
        case ModifyType.goDown:
          return "Down"
      }
      return 'Save';
  }
  customeContent(){
      const confirmMessage='Are you sure this ';
      const createMessage='Save successful!!!';
      const validMessage='Input invalid!!!';
      const noticeMessage='Your working not save!!!';
      
      switch(this.wayModify){
        case ModifyType.delete:
          if (this.typeSelection== VideoType.course)
              return confirmMessage+ 'course?'
          else if(this.typeSelection ==VideoType.section)
              return confirmMessage +'section?';
            return confirmMessage +' lession?';
        case ModifyType.save:
           return createMessage;
        case ModifyType.errorValid:
          return validMessage;  
        case ModifyType.leave:
          return noticeMessage;
        case ModifyType.goUp:
          if(this.typeSelection==VideoType.lession)
            return confirmMessage+ 'up level this lession?';
          return confirmMessage+' up level this section?'
        case ModifyType.goDown:
          if(this.typeSelection== VideoType.section){
            return confirmMessage+ 'down level this section?';
          }
            return confirmMessage+ 'down level this lession?'
         
            
        return '';
      }
      return '';
  }

  onConfirmSave(){
      if(this.typeSelection==VideoType.lession  || this.typeSelection==VideoType.section){
        if(this.wayModify== ModifyType.edit || this.wayModify==ModifyType.new){
          // console.log(this.titleBinding);
          this.fullCourseService.handleUpdate(this.titleBinding);
        }
         else
         {
           this.fullCourseService.handleUpate();
         }

      }
      if(this.fullCourseService.wayModify==ModifyType.delete &&
         this.fullCourseService.typeSelection== VideoType.course){
          // this.router.navigate(['../','course','new'], {relativeTo:this.route})
            
          this.router.navigateByUrl('/admin/home').then();
          //  this.activeModal.close();
          this.modalService.dismissAll();
      }
      else{
        // window.location.reload();
      }
     
  }
  goBack(){
    this.router.navigateByUrl('/admin/home').then();
    console.log("Thao");
  }
}
