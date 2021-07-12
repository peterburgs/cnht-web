import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { throwIfEmpty } from 'rxjs/operators';

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
  @Input() sectionIndex: number=0;
  arrayLoading:boolean[]=[];
  videoFile:File=new File([],'lecture-video')
  sectionTitle='';
  changeSection=false;
  constructor(private modalService: NgbModal,
              private fullCourseService: FullCourseService) {}
  ngOnInit(): void {
    this.arrayLoading= this.fullCourseService.getArrayLoading();
  }
  clickEditSection($event:any){
      this.sectionTitle=$event.target.value;
      this.changeSection=true;

  }
  saveSection(idSection:string){
      this.fullCourseService.setSelection(idSection, VideoType.section, ModifyType.edit);
      this.fullCourseService.handleEditSection(this.sectionTitle).subscribe(response=>{
      }, error=>{
        alert('Server disconnect at this time, try again');
        
      });
      this.changeSection=false;
  }
  
  onEditSection(){
    this.fullCourseService.setSelection(this.sectionDummy.section_id, VideoType.section, ModifyType.edit);
    this.fullCourseService.onNotifyContent();
  }

  onDeleteSection(){
    this.fullCourseService.setSelection(this.sectionDummy.section_id, VideoType.section, ModifyType.delete);
    this.fullCourseService.onNotifyContent();
  }
  onCreateLession(idSection:string){

    console.log(idSection);
    this.fullCourseService.setSelection(idSection, VideoType.lecture, ModifyType.new);
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

}
