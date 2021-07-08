import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
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
export class SectionCourseComponent implements OnInit, OnChanges {

  @Input() section!: Section;
  listLecture : Lecture[]=[];
  video!: Video;
  constructor(
    private courseService: CourseService,
    private route: Router,
    private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.getLecturesBySectionId(this.section.id);
    
  }
  ngOnChanges(changes:SimpleChanges){
      if(changes.section){
        this.ngOnInit()
      }
  }

  //TODO:get lectures of section by section id
  getLecturesBySectionId( sectionId:string){
    // this.listLecture= this.courseService.getLecturesBySectionId(sectionId);
    // //! OPEN COMMAND WHEN HAVE API
    this.courseService.getLecturesBySectionId(sectionId).subscribe(responseData=>{
      this.listLecture= responseData.lectures.sort((a,b)=> {return (a.lectureOrder-b.lectureOrder)})
      console.log("Lecture ")
      console.log(this.listLecture)
    })
  }

  //get video of lecture by lecture id
  getVideoByLectureId(lectureId: string): string{
    // this.courseService.getVideoByLectureId(lectureId).subscribe(video=>
    //     this.video= video
    // )
    //return this.video.length;
    return "1m30s"
  }

  loadLecture(lectureId:string)
  {
  
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
