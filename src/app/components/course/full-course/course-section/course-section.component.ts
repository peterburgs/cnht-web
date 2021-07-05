import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Upload } from 'src/app/models/file-upload';
import { ModifyType } from 'src/app/models/ModifyType';
import { Section } from 'src/app/models/section.model';
import { SectionDummy } from 'src/app/models/sectionDummy.model';
import { VideoType } from 'src/app/models/VideoType.model';
import { FullCourseService } from '../full-course.service';
import { UploadService } from '../upload.service';
@Component({
  selector: 'app-course-section',
  templateUrl: './course-section.component.html',
  styleUrls: ['./course-section.component.css'],
})
export class CourseSectionComponent implements OnInit {
  
  @Input() sectionDummy: SectionDummy = new SectionDummy("1","default",[]);
 
  urlVideo = '../';
  files?: File;
  
  fileToUpLoad: File = new File([], 'hinh-a');
  constructor(private modalService: NgbModal,
              private fullCourseService: FullCourseService) {}
  ngOnInit(): void {
  }

  onEditLession(id:string) {
    this.fullCourseService.setSelection(id, VideoType.lession, ModifyType.edit);
    this.fullCourseService.onNotifyContent();
    console.log(id);
  }
  onEditSection(){
   
    this.fullCourseService.setSelection(this.sectionDummy.section_id, VideoType.section, ModifyType.edit);
    this.fullCourseService.onNotifyContent();
  }
  onDeleteLession(id:string){
    this.fullCourseService
    .setSelection(id, VideoType.lession, ModifyType.delete);
    this.fullCourseService.onNotifyContent();
  }
  onDeleteSection(){
    this.fullCourseService.setSelection(this.sectionDummy.section_id, VideoType.section, ModifyType.delete);
    this.fullCourseService.onNotifyContent();
  }
  onCreateLession(idSection:string){
    //handle something
    // this.fullCourseService.setCurrentSectionSelection(idSection);
    console.log(idSection);
    this.fullCourseService.setSelection(idSection, VideoType.lession, ModifyType.new);
    this.fullCourseService.onNotifyContent();
  }
  onUpSection(){
    this.fullCourseService.setSelection(this.sectionDummy.section_id, VideoType.section, ModifyType.goUp);
    this.fullCourseService.onNotifyContent();
  }
  onDownSection(){
    this.fullCourseService.setSelection(this.sectionDummy.section_id, VideoType.section, ModifyType.goDown);
    this.fullCourseService.onNotifyContent();
  }
  onUpLession(id:string){
       //handle something
      //  this.fullCourseService.setCurrentSectionSelection(id);
      //  this.fullCourseService.setSelection("", VideoType.lession, ModifyType.new);
      //  this.fullCourseService.onEditContent();
      this.fullCourseService.setSelection(id, VideoType.lession, ModifyType.goUp);
      this.fullCourseService.onNotifyContent();
  }
  onDownLession(id:string){
    this.fullCourseService.setSelection(id, VideoType.lession, ModifyType.goDown);
    this.fullCourseService.onNotifyContent();
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

      reader.readAsDataURL(this.fileToUpLoad);
    }
  }
  
}
