import { Component, Input, OnInit } from '@angular/core';
import { Lecture } from 'src/app/models/lecture.model';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { throwIfEmpty } from 'rxjs/operators';

import { ModifyType } from 'src/app/models/ModifyType';

import { SectionDummy } from 'src/app/models/sectionDummy.model';
import { VideoType } from 'src/app/models/VideoType.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FullCourseService } from 'src/app/service/full-course.service';
import { fakeAsync } from '@angular/core/testing';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-course-lecture',
  templateUrl: './course-lecture.component.html',
  styleUrls: ['./course-lecture.component.css']
})
export class CourseLectureComponent implements OnInit {

  @Input() lecture: Lecture= new Lecture();
  @Input() lectureIndex: number =0;
  durationVideo:number[]=[]
  urlVideo = '../';
  videoURL: SafeUrl='';
  files?: File;
  hasVideo=false;
  changeLecture=false;
  videoFile:File=new File([],'lecture-video')
  lectureTitle='';
  sectionTitle='';
  changeSection=false;
  fileToUpload= new File([],'default');
  duration:number=0;
  eventSave=false;
  loading=true;
  timeVideo=0;
  sbjLoadingDuration= new Subject<number>();
  constructor(private fullCourseService: FullCourseService
    , private sanitizer: DomSanitizer){

  }
  ngOnInit(): void {
    this.fullCourseService.getVideoInfo(this.lecture.id).toPromise().then(response=>{
        this.timeVideo= response.video.length;
    }).catch(error=>{
        this.timeVideo=0;
    })
    this.sbjLoadingDuration.subscribe(duration=>{
        if(this.fileToUpload.name != 'default')
        {
           this.fullCourseService.handleUpdateWithVideo(this.fileToUpload, this.duration);
        }
    })
  }
  getSbjLoadingDuration() {
    return this.sbjLoadingDuration.asObservable();
  }
  clickEditLecture($event:any){
    console.log('save');
    this.eventSave=true;
    this.lectureTitle=$event.target.value;
    console.log(this.lectureTitle);
 
  }
  saveLecture(idLecture:string){

    this.fullCourseService.setSelection(idLecture, VideoType.lession, ModifyType.edit)
    this.fullCourseService.handleEditTitleLecture(this.lectureTitle).subscribe
    (response=>{
    }, error=>{
      alert('Server disconnect at this time, try again');
    });
  }
  enableChangeLecture(event:any){
    
    this.changeLecture=true;
    this.lectureTitle=event?.target.value;
   
  }
  onEditLession(id:string) {
    this.fullCourseService.setSelection(id, VideoType.lession, ModifyType.edit);
    // this.fullCourseService.onNotifyContent();
    console.log(id);
  }

  onUpLession(id:string){
   this.fullCourseService.setSelection(id, VideoType.lession, ModifyType.goUp);
   this.fullCourseService.setItemIndex(this.lectureIndex);
   this.fullCourseService.onNotifyContent();
}
onDownLession(id:string){
 this.fullCourseService.setSelection(id, VideoType.lession, ModifyType.goDown);
 this.fullCourseService.setItemIndex(this.lectureIndex);
 this.fullCourseService.onNotifyContent();
}

formatTime(duration:number){
 let duration_format='';
 let time= duration;
 duration_format= String(time/60)+':';
 time=time%60;
 if(time<10) return duration_format+ '0'+String(time);
 return duration_format + String(time);
}
onDeleteLession(id:string){
  this.fullCourseService
  .setSelection(id, VideoType.lession, ModifyType.delete);
  this.fullCourseService.onNotifyContent();
}
handleFileInput(event: Event, idLecture: string) {
 
}

readVideoUrl(event: any, idLecture:string) {
  const files = event.target.files;
  if (files && files[0]) {
    
    
    this.fullCourseService.setSelection(idLecture,VideoType.lession, ModifyType.edit);
    console.log('FileUpload -> files', files);
    this.fileToUpload = files[0];
    this.videoURL = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(files[0]));
  }

}

getDuration(e:any) {
  this.duration= e.target.duration;
  this.sbjLoadingDuration.next(this.duration);
  
}
}
