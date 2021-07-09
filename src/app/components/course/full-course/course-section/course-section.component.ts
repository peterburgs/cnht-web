import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ModifyType } from 'src/app/models/ModifyType';

import { SectionDummy } from 'src/app/models/sectionDummy.model';
import { VideoType } from 'src/app/models/VideoType.model';
import { FullCourseService } from '../../../../service/full-course.service';

@Component({
  selector: 'app-course-section',
  templateUrl: './course-section.component.html',
  styleUrls: ['./course-section.component.css'],
})
export class CourseSectionComponent implements OnInit {
  
  @Input() sectionDummy: SectionDummy = new SectionDummy("1","default",[]);
  eventSave:boolean[]=[]
  durationVideo:number[]=[]
  urlVideo = '../';
  files?: File;
  hasVideo=false;
  changeLecture=false;
  videoFile:File=new File([],'lecture-video')
  lectureTitle='';
  sectionTitle='';
  changeSection=false;
  constructor(private modalService: NgbModal,
              private fullCourseService: FullCourseService) {}
  ngOnInit(): void {
    for(let i=0; i< this.sectionDummy.lecture.length; i++){
      this.eventSave.push(false);
      this.durationVideo.push(0);
    }
  }
  clickEditSection($event:any){
      this.sectionTitle=$event.target.value;
      this.changeSection=true;

  }
  saveSection(idSection:string){
      this.fullCourseService.setSelection(idSection, VideoType.section, ModifyType.edit);
      this.fullCourseService.handleEditSection(this.sectionTitle).subscribe(response=>{
        if(response.count<0){
          console.log(response);
          alert('Error happen try again');
        }
      }, error=>{
        alert('Server disconnect at this time, try again');
        
      });
      this.changeSection=false;
      
  }
  clickEditLecture($event:any,order:number){
    console.log('save');
    this.eventSave[order]=true;
    this.lectureTitle=$event.target.value;
    console.log(this.lectureTitle);

  }
  saveLecture(idLecture:string, order:number){

    this.fullCourseService.setSelection(idLecture, VideoType.lession, ModifyType.edit)
    this.fullCourseService.handleEditTitleLecture(this.lectureTitle).subscribe
    (response=>{
    }, error=>{
      alert('Server disconnect at this time, try again');
    });
    
    this.eventSave[order]=false;
  }
  enableChangeLecture(event:any){
    
    this.changeLecture=true;
    this.lectureTitle=event?.target.value;
   
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

  // getVideo(idLecture:string, order:number){
  //   console.log("from video");

    // this.fullCourseService.getLectureVideo(idLecture).subscribe((video)=>{
    //   this.durationVideo[order]=2;
    // })

  //   this.durationVideo[order]=2
    // check
    //
   
    
  //   this.hasVideo=true;
  // }
  
}
