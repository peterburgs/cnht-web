import { Component, Input, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';
import { Course } from 'src/app/models/course.model';
import { Section } from 'src/app/models/section.model';
import { CourseService } from 'src/app/service/course.service';
import { Lecture } from 'src/app/models/lecture.model';
import { Video } from 'src/app/models/video.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-section-course',
  templateUrl: './section-course.component.html',
  styleUrls: ['./section-course.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class SectionCourseComponent implements OnInit{

  @Input() section!: Section;
  @Input()firstSectionOrder!:number;
  listLecture : Lecture[]=[];
  video!: Video;
  selectedLecture!:string;

  constructor(
    private courseService: CourseService,
    private route: Router,
    private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    //load first lecture of first section on default
    console.log("On init")
    this.courseService.getLecturesBySectionId(this.section.id).subscribe(responseData=>{

      this.listLecture= responseData.lectures.sort((a,b)=> {return (a.lectureOrder-b.lectureOrder)})
      for(let i=0;i<this.listLecture.length;i++){
        this.courseService.getVideoLength(this.listLecture[i].id).toPromise()
        .then(data=>{
          console.log("data VIDEO")
          console.log(data)
          this.listLecture[i].length= data.video.length;
        })
        .catch(error=>console.log(error))
       }

      if(this.section.sectionOrder==this.firstSectionOrder){
      this.loadLecture(this.listLecture[0].id)

      }
    })

    this.activeRoute.params.subscribe(params=>{
      let lectureId= params['lectureId'];
      this.selectedLecture=lectureId;

    })
    
  }


  getLecturesBySectionId( sectionId:string){
  
    this.courseService.getLecturesBySectionId(sectionId)
    .toPromise().then(responseData=>{
      this.listLecture= responseData.lectures.sort((a,b)=> {return (a.lectureOrder-b.lectureOrder)})
      
       for(let i=0;i<this.listLecture.length;i++){
        this.courseService.getVideoLength(this.listLecture[i].id).toPromise()
        .then(data=>{
          
          this.listLecture[i].length= data.video.length;
        })
        .catch(error=>{
          this.listLecture[i].length=0;
        })
       }
        this.loadLecture(this.listLecture[0].id)

      })

  
  }

  //get video of lecture by lecture id
 
  formatTime(time:number){
    if(time==undefined) return '00:00'
    if(time==0) return '00:00'
    if(time<60) return '00:'+time;
    let h=0;
    let m=0;
    let s=0;
    let format='';
    if(time>3600){
      h= Math.floor(time/3600);
      m= Math.floor((time%3600)/60);
      s= (time%3600)%60
      format='0'+h+':';
      if(m<10)
        format+='0'+m+':';
      else format+=m+':';
      if(s<10)
        format+='0'+s;
      else format+=s;
      return format;
    }
    else{
      m= Math.floor(time/60);
      s=time%60;
      if(m<10)
        format+='0'+m+':';
      else
        format+=m+':';
        if(s<10)
        format+='0'+s;
      else format+=s;
      return format;
    }

  }

  loadLecture(lectureId:string)
  {
    //*in detail course screen, learner can not click lecture link
    this.activeRoute.fragment.subscribe(fragment=>{
      if(fragment=='learning')
      {
     let courseId;
        
        this.activeRoute.params.subscribe(params=>{
          courseId=params['courseId'];
        })
      this.route.navigate(['/learning',courseId,this.section.id,lectureId],{fragment:'learning'});  

      }
    })

  }

}
