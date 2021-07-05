import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, Subscription } from 'rxjs';
import { Lession } from 'src/app/models/lession.model';
import { ModifyType } from 'src/app/models/ModifyType';
import { Section } from 'src/app/models/section.model';
import { VideoType } from 'src/app/models/VideoType.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Course } from 'src/app/models/course.model';
import { Lecture } from 'src/app/models/lecture.model';

import { SectionDummy } from 'src/app/models/sectionDummy.model';
import { COURSE_TYPE } from 'src/app/models/course-type';
import { GRADES } from 'src/app/models/grades';
import { Video } from 'src/app/models/video.model';
import { throwIfEmpty } from 'rxjs/operators';
import { createNgModuleType } from '@angular/compiler/src/render3/r3_module_compiler';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class FullCourseService {
  //================================= Data hook=========================
  private course: Course = {
    id: '',
    title: 'Default title',
    courseDescription: 'description',
    price: 0,
    courseType: COURSE_TYPE.THEORY,
    grade: GRADES.TWELFTH,
    thumbnailUrl:
      'https://images.unsplash.com/photo-1613905780946-26b73b6f6e11?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1052&q=80',
    createdAt: new Date(),
    updatedAt:  new Date(),
    isHidden: false,
  };
  private sections: Section[] = [];
  private lectures: Lecture[] = [];
  private listDeepSection: SectionDummy[] = [];

  //================================= Initial =========================
  //save edit Modal in screen
  
  idItem: string = 'default';
  isValid = true;
  idCourse: string = 'default';
  wayModify = ModifyType.new;
  typeSelection = VideoType.lession;
  invokeNotifyModal = new EventEmitter();
  invokeValidModal= new EventEmitter();
  subsEdit?: Subscription;
  subsDelete?: Subscription;
  subsValid?: Subscription;
  //====== Subject observable
  sbjTypeSelection = new Subject<VideoType>();
  sbjWayModify = new Subject<ModifyType>();
  sbjIdItem = new Subject<string>();

  constructor(private http: HttpClient) {}
 
  //================================= GET =========================
  getLecturesCourse() {
    return this.lectures;
  }
  getCourseInfo() {
    return this.course;
  }
  getValidate() {
    return this.isValid;
  }
  getLectureSelection() {
    //TODO: update way get when have API
  
    return this.lectures.filter((lecture:Lecture) => (lecture.id === this.idItem))[0];
  }
  getSectionSelection() {
    return this.sections.filter((section) => (section.id == this.idItem));
  }
  getCurrentSelection(): Observable<VideoType> {
    return this.sbjTypeSelection.asObservable();
  }
  getWayModify() {
    return this.sbjWayModify.asObservable();
  }
  //================================= SET =========================
  setIsValid(flat: boolean) {
    this.isValid = flat;
  }
  setCurrentSectionSelection(idSection: string) {
    this.getSectionSelection()[0].id = idSection;
  }
  setSelection(id: string, type: VideoType, way: ModifyType) {
    this.idItem = id;
    console.log(this.idItem);
    this.sbjIdItem.next(this.idItem);
    this.typeSelection = type;
    this.sbjTypeSelection.next(this.typeSelection);

    this.wayModify = way;
    this.sbjWayModify.next(this.wayModify);

  }
  setIdCourse(id: string) {
    this.idCourse = id;
  }
  //================================= METHOD =========================

  onNotifyContent() {
    this.invokeNotifyModal.emit();
  }

  onValidateInput() {
    this.invokeValidModal.emit();
  }
  onUpSection() {
   //if is the first, cannot up
   let upSection:Section=this.getSectionSelection()[0]; 
      if(upSection.sectionOrder<= 1){
        return;
      }
    let sectionSwap: Section=this.sections
      .filter(section=>section.sectionOrder==(upSection.sectionOrder-1))[0];
    sectionSwap.sectionOrder=sectionSwap.sectionOrder;

    this.onSaveSection(sectionSwap.id,sectionSwap);

    upSection.sectionOrder=upSection.sectionOrder-1;
      this.onSaveSection(upSection.id, upSection);

  }
  onDownSection() {
    let downSection:Section=this.getSectionSelection()[0];
    //Last section canot down 
    if(downSection.sectionOrder == (this.sections.length-1)){
      return;
    }
    let sectionSwap: Section=this.sections
    .filter(section=>section.sectionOrder==(downSection.sectionOrder+1))[0];
    sectionSwap.sectionOrder=sectionSwap.sectionOrder-1;

    this.onSaveSection(sectionSwap.id,sectionSwap);

    downSection.sectionOrder=downSection.sectionOrder+1;
    this.onSaveSection(downSection.id, downSection);

  }
  onUpLession() {
    let upLecture:Lecture= this.getLectureSelection();

    if (upLecture.lectureOrder==0){
      return;
    }

    let minOrderOfSection=-1;
    this.lectures.forEach((lecture)=>{
        if(lecture.sectionId==upLecture.sectionId){
          minOrderOfSection= lecture.lectureOrder
          return
        }
    })
    //Up level, this lecturer will up section
    if(minOrderOfSection==upLecture.lectureOrder ){
        let oldSection= this.sections.filter((section)=>{
              section.id= upLecture.sectionId;
        })[0];

        this.sections.forEach((section)=>{
          if (section.sectionOrder== (oldSection.sectionOrder-1))
          {
            upLecture.sectionId=section.id;
            this.onSaveLecture(upLecture);
          }
        })
    }
    //Up common
    this.lectures.forEach((lecture)=>{
     if(lecture.lectureOrder== (upLecture.lectureOrder-1)){
          lecture.lectureOrder=lecture.lectureOrder+1;
          this.onSaveLecture(lecture);
          upLecture.lectureOrder=upLecture.lectureOrder-1;
          return;
     }
    })
  }
  onDownLession() {
    let downLecture:Lecture= this.getLectureSelection();

    if (downLecture.lectureOrder== this.lectures.length-1){
      return;
    }

    let maxOrderOfSection=-1;
    this.lectures.forEach((lecture)=>{
        if(lecture.sectionId==downLecture.sectionId){
          maxOrderOfSection= lecture.lectureOrder
        }
    })
    //Up level, this lecturer will up section
    if(maxOrderOfSection==downLecture.lectureOrder ){
        let oldSection= this.sections.filter((section)=>{
              section.id= downLecture.sectionId;
        })[0];

        this.sections.forEach((section)=>{
          if (section.sectionOrder== (oldSection.sectionOrder+1))
          {
            downLecture.sectionId=section.id;
            this.onSaveLecture(downLecture);
          }
        })
    }
    //Up common
    this.lectures.forEach((lecture)=>{
     if(lecture.lectureOrder== (downLecture.lectureOrder+1)){
          lecture.lectureOrder=lecture.lectureOrder-1;
          this.onSaveLecture(lecture);
          downLecture.lectureOrder=downLecture.lectureOrder+1;
          return;
     }
    })

  }
  
  
  //================ HTTP ===============
  private apiUrlCourse = 'http://localhost:5000/courses';
  private apiUrlSection = 'http://localhost:5000/sections';
  private apiUrlLecture = 'http://localhost:5000/lectures';
  getCourses(): Observable<Course[]> {
    // return this.http.get<Course[]>(this.apiUrlCourse);
    return of(this.mcourses);
  }
  getData() {
    // this.http
    //   .get<Section[]>(this.apiUrlSection)
    //   .toPromise()
    //   .then((sectionsData) => {
    //     this.sections = sectionsData;
    //     this.http
    //       .get<Lecture[]>(this.apiUrlLecture)
    //       .toPromise()
    //       .then((lecturesData) => {
    //         this.lectures = lecturesData;
    //         console.log(this.lectures);
    //         this.sections.forEach((section) => {
    //           console.log(section);
    //           let tmpLecturers: Lecture[] = this.lectures.filter(
    //             lecture => lecture.sectionId == section.id
    //           );
    //           console.log(tmpLecturers);
    //           this.listDeepSection.push(
    //             new SectionDummy(section.id, section.title, tmpLecturers)
    //           );
    //         });
    //       });
    //   });
    this.sections= this.mSectionList;
    this.lectures= this.mLectureList;

      
    this.sections.forEach((section) => {
               // console.log(section);
                let tmpLecturers: Lecture[] = this.lectures.filter(
                  lecture => lecture.sectionId == section.id
                );
               // console.log(tmpLecturers);
                this.listDeepSection.push(
                  new SectionDummy(section.id, section.title, tmpLecturers)
                );
    })
    console.log(this.listDeepSection);
    

  }
  getLectures(): Observable<Lecture[]> {
    return this.http.get<Lecture[]>(this.apiUrlLecture);
  }
  getSectionDummy() {
    return this.listDeepSection;
  }
  getTitleContent(){
    console.log(this.idItem);
    let title=''
    if(this.typeSelection== VideoType.section){
      this.sections.forEach((section) => {
        if(section.id == this.idItem){
          title=section.title;
        }
       });
    }
    else{
      this.lectures.forEach((lecturer)=>{
        if(lecturer.id == this.idItem){
          title=lecturer.title;
        }
      })
    }
    return title;
  }
  setCourseSelection(idCourse: string) {
    this.idCourse = idCourse;
  }
  setCourse(course: Course){
      this.course.title=course.title;
      this.course.grade= course.grade;
      this.course.courseType=course.courseType;
      this.course.courseDescription= course.courseDescription;
      //TODO: url find where
      this.course.thumbnailUrl= course.thumbnailUrl;
  }
  getDataServe() {
    //Create mode
    if (this.idCourse == 'default') {
      //TODO: add create new section
      this.sections.push({
        courseId: '1',
        id: 'course1sec1',
        title: 'Section 1',
        isHidden: false,
        sectionOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      this.lectures = [];

      this.onCreateCourse(this.course).subscribe((course) => {
        this.course = course;
        console.log(this.course);

        let firstSection: Section=new Section();
        firstSection.title="Section 1";
        this.onCreateSection(firstSection).subscribe((section)=>{
            this.getData();
        })
        // var firstSectionDummy: SectionDummy = new SectionDummy(
        //   'default',
        //   'Section 1',
        //   []
        // );
        // this.listDeepSection.push(firstSectionDummy);
      });
    }
    else{

      this.getData();
    }
    }
  
  //Another
  handleUpate() {
    if(this.typeSelection==VideoType.course){
        switch (this.wayModify){
          case ModifyType.delete:
              this.onDeleteCourse();
              return;
          case ModifyType.save:
              this.onSaveCourse();
            return;
        }
    }else if (this.typeSelection ==VideoType.section){
      switch (this.wayModify){
        case ModifyType.delete:
              this.onDeleteSection();
              return;
       
        case ModifyType.goUp:
              this.onUpSection();
              return;
        case ModifyType.goDown:
              this.onDownSection();
              return;
      }

    } else if(this.typeSelection ==VideoType.lession){
      switch (this.wayModify){
        case ModifyType.delete:
              this.onDeleteLecture();
              return;
        case ModifyType.goUp:
              this.onUpLession();
              return;
        case ModifyType.goDown: 
            this.onDownLession();
            return;
      }
    }
  }
  //Edit and new
  handleUpdate(title: string) {
    if (this.wayModify == ModifyType.edit) {
      if (this.typeSelection == VideoType.lession) {
        var tmpLecturer = this.getLectureSelection();

        if (tmpLecturer != null) {
          tmpLecturer.title = title;
          this.onSaveLecture(tmpLecturer);
        }
      } else {
        
        var tmpSection = this.getSectionSelection()[0];
       console.log(tmpSection);
        if (tmpSection != null) {
          tmpSection.title = title;
          this.onSaveSection(this.idItem,tmpSection);
        }
      }
    } else if (this.wayModify == ModifyType.new) {
      if (this.typeSelection == VideoType.section) {
        let tmpSection = new Section();
        tmpSection.title = title;
        tmpSection.courseId = this.course.id;
        tmpSection.isHidden = false;
        this.onCreateSection(tmpSection);
      } else if (this.typeSelection == VideoType.lession) {
        let tmpLecture = new Lecture();
        //TODO: add more about File Video
        tmpLecture.title = title;
        tmpLecture.sectionId = this.getSectionSelection()[0].id;
        tmpLecture.idHidden = false;
        this.onCreateLecture(tmpLecture);
      }
    }
  }

  onSaveSection(sectionId:string,section: Section): Observable<Section> {
    //TODO: Http

    console.log('Save section ');
    console.log(section);
    // const url = `${this.apiUrlSection}/${sectionId}`;
    // return this.http.put<Section>(url, section,httpOptions);

    this.mSectionList.forEach((dataSection)=>{
        if(dataSection.id== sectionId){
          dataSection.title=section.title;
        }
    })
    return of(section);
  }
  onSaveLecture( lecturer: Lecture): Observable<Lecture> {
    //TODO: Http
    console.log('Save lecturer ');
    console.log(lecturer);
    const url = `${this.apiUrlLecture}/${lecturer.id}`;
    return this.http.put<Lecture>(url, lecturer, httpOptions);

    
  }
  onSaveCourse(): Observable<Course> {
    //TODO: Http
    console.log('Save Course ');
    console.log(this.course); 
    const url = `${this.apiUrlCourse}/${this.course.id}`;
    return this.http.put<Course>(url, this.course, httpOptions);
  }
  onDeleteSection() {
    //TODO: Http
    console.log("Delete Section :"+this.idItem);
  }
  onDeleteCourse() {
    //TODO: Http
    console.log("Delete Course :"+this.idItem);
  }
  onDeleteLecture() {
    //TODO: Http
    console.log("Delete Lecturer :"+this.idItem);
  }
  onCreateSection(section: Section) {
    console.log('Create section '+section.title);
    return this.http.post<Section>(this.apiUrlSection, section);
  }
  onCreateCourse(course: Course): Observable<Course> {
    console.log('Create course '+course.title);
    return this.http.post<Course>(this.apiUrlCourse, course);
  }
  onCreateLecture(lecturer: Lecture) {
    console.log('Create lecturer '+lecturer.title);
    return this.http.post<Lecture>(this.apiUrlLecture, lecturer);
  }
  //=============== Create HTTP===================

  //================ Mockup data ==================
  private mcourses: Course[]=[{
    id: "1",
    title: "Giải phương trình bậc 3",
    courseDescription: "Description",
    price:150000,
    courseType: COURSE_TYPE.THEORY,
    grade: GRADES.TENTH,
    thumbnailUrl: "string",
    createdAt: new Date(),
    updatedAt: new Date(),
    isHidden: false
  },]
  private mSectionList : Section[]=[
    {
        courseId:'1',
        id:'course1sec1',
        title:'Lý thuyết phương trình',
        isHidden: false,
        sectionOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      
    },
    {
        courseId:'1',
        id:'course1sec2',
        title:'Phương trình tuyến tính',
        isHidden: false,
        sectionOrder: 2,
        createdAt:new Date(),
        updatedAt: new Date(),
    
    }
  ]
  private  mLectureList :Lecture[]=[
    {
        id:'co1sec1lec1',
        title:"Video 1",
        lectureOrder:1,
        idHidden:false,
        sectionId:'course1sec1',
        createdAt:new Date(),
        updatedAt:new Date()
    },
    {
        id:'co1sec1lec2',
        title:"Video 2",
        lectureOrder:2,
        idHidden:false,
        sectionId:'course1sec1',
        createdAt:new Date(),
        updatedAt:new Date()
    },
    {
        id:'co1sec2lec1',
        title:"Video 1",
        lectureOrder:1,
        idHidden:false,
        sectionId:'course1sec2',
        createdAt:new Date(),
        updatedAt:new Date()},
    {
        id:'co1sec2lec2',
        title:"Video 2",
        lectureOrder:2,
        idHidden:false,
        sectionId:'course1sec2',
        createdAt:new Date(),
        updatedAt:new Date()
    },
    {
        id:'co1sec2lec3',
        title:"Video 3",
        lectureOrder:3,
        idHidden:false,
        sectionId:'course1sec2',
        createdAt:new Date(),
        updatedAt:new Date()
    },
 
]


}
