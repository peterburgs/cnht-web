import { Component, Input, OnInit } from '@angular/core';
import { Lecture } from 'src/app/models/lecture.model';

import { ModifyType } from 'src/app/models/ModifyType';

import { VideoType } from 'src/app/models/VideoType.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FullCourseService } from 'src/app/service/full-course.service';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-course-lecture',
  templateUrl: './course-lecture.component.html',
  styleUrls: ['./course-lecture.component.css']
})
export class CourseLectureComponent implements OnInit {

  @Input() lecture: Lecture= new Lecture();
  @Input() lectureIndex: number =0;
  @Input() sectionIndex: number =0;
  @Input() globalLoading:boolean=false;
  @Input() maxLecture: number=0;
  videoURL: SafeUrl='';
  files?: File;
  hasVideo=false;
  changeLecture=false;
  videoFile:File=new File([],'lecture-video')
  lectureTitle='';
  fileToUpload= new File([],'default');
  duration:number=0;
  eventSave=false;
  
  timeVideo=0;
  sbjLoadingDuration= new Subject<number>();
  constructor(private fullCourseService: FullCourseService
    , private sanitizer: DomSanitizer){

  }
  ngOnInit(): void {
    this.fullCourseService.getVideoInfo(this.lecture.id).toPromise().then(response=>{
        this.timeVideo= response.video.length;
    }).catch(error=>{
        this.timeVideo=-1;
    })
    this.sbjLoadingDuration.subscribe(duration=>{
        if(this.fileToUpload.name != 'default')
        {
           this.fullCourseService.handleUpdateWithVideo(this.fileToUpload, this.duration, this.sectionIndex, this.lectureIndex);
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

  }
  saveLecture(idLecture:string){

    this.fullCourseService.setSelection(idLecture, VideoType.lecture, ModifyType.edit)
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
  onEditLecture(id:string) {
    this.fullCourseService.setSelection(id, VideoType.lecture, ModifyType.edit);
    // this.fullCourseService.onNotifyContent();
    console.log(id);
  }

  onUpLecture(id:string){
   this.fullCourseService.setSelection(id, VideoType.lecture, ModifyType.goUp);
   this.fullCourseService.setItemIndex(this.lectureIndex);
   this.fullCourseService.onNotifyContent();
}
onDownLecture(id:string){
 this.fullCourseService.setSelection(id, VideoType.lecture, ModifyType.goDown);
 this.fullCourseService.setItemIndex(this.lectureIndex);
 this.fullCourseService.onNotifyContent();
}

onDeleteLecture(id:string){
  this.fullCourseService
  .setSelection(id, VideoType.lecture, ModifyType.delete);
  this.fullCourseService.onNotifyContent();
}
handleFileInput(event: Event, idLecture: string) {
 
}

readVideoUrl(event: any, idLecture:string) {

  const files = event.target.files;
  if (files && files[0]) {
    this.fullCourseService.setSelection(idLecture,VideoType.lecture, ModifyType.edit);
    console.log(this.sectionIndex +' lecture '+this.lectureIndex);
    this.fullCourseService.setPositionLoading(true, this.sectionIndex, this.lectureIndex);

    this.fileToUpload = files[0];
    //Show video to <video> to get duration
    this.videoURL = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(files[0]));
  }

}

getDuration(e:any) {
  this.duration= e.target.duration;
  this.timeVideo=Math.round(this.duration); 
  this.sbjLoadingDuration.next(this.timeVideo);
}
ngOnDestroy(): void {
  //Called once, before the instance is destroyed.
  //Add 'implements OnDestroy' to the class.
  this.sbjLoadingDuration.unsubscribe();
}
}
