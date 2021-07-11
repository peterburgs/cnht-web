import { EventEmitter, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  from,
  Observable,
  of,
  Subject,
  Subscription,
} from 'rxjs';
import { Lession } from 'src/app/models/lession.model';
import { ModifyType } from 'src/app/models/ModifyType';
import { Section } from 'src/app/models/section.model';
import { VideoType } from 'src/app/models/VideoType.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Course } from 'src/app/models/course.model';
import { Lecture } from 'src/app/models/lecture.model';

import { SectionDummy } from 'src/app/models/sectionDummy.model';
import { COURSE_TYPE } from 'src/app/models/course-type';
import { GRADES } from 'src/app/models/grades';
import { Video } from 'src/app/models/video.model';
import { max } from 'rxjs/operators';
import { faTintSlash } from '@fortawesome/free-solid-svg-icons';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token'),
  }),
};

@Injectable({
  providedIn: 'root',
})
export class FullCourseService {
  //================================= Data hook=========================
  private course: Course = new Course();
  private fileThumbnail: File = new File([], 'thumbnail-default');
  private sections: Section[] = [];
  private lectures: Lecture[] = [];
  private courses: Course[] = [];
  private listDeepSection: SectionDummy[] = [];
  private videos: Video[] = [];
  private durations: number[]=[];
  private baseURL =
    'https://us-central1-supple-craft-318515.cloudfunctions.net/app/api/';
  private authHeader = new HttpHeaders();
  private idToken = localStorage.getItem('token');

  //================================= Initial =========================
  //save edit Modal in screen
  itemIndex=0;
  idItem: string = 'default';
  isValid = true;
  idCourse: string = 'default';
  status = 100;
  wayModify = ModifyType.new;
  typeSelection = VideoType.lession;
  invokeNotifyModal = new EventEmitter();
  invokeValidModal = new EventEmitter();
  subsEdit?: Subscription;
  subsDelete?: Subscription;
  subsValid?: Subscription;
  subsStatus?: Subscription;
  //====== Subject observable
  sbjTypeSelection = new Subject<VideoType>();
  sbjWayModify = new Subject<ModifyType>();
  sbjIdItem = new Subject<string>();
  sbjSectionDummy = new Subject<SectionDummy[]>();
  sbjCreateCourse = new Subject<Course>();
  sbjStatus = new Subject<number>();
  headers: HttpHeaders = new HttpHeaders();

  constructor(private http: HttpClient) {
    this.idToken = localStorage.getItem('token');
    // this.initCourses();
    this.authHeader.append('Content-Type', 'application/json');
    this.authHeader.append('Authorization', 'Bearer ' + this.idToken);

    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer' + this.idToken,
    });
  }

  //================================= GET =========================
  setCourseSelection() {
    console.log(this.idCourse);
    console.log(this.courses);
    this.courses.forEach((mCourse) => {
      console.log(mCourse.id);
      if (mCourse.id == this.idCourse) {
        console.log(mCourse);
        console.log('thaoooo');
        this.course = mCourse;
      }
    });
    console.log('Thao');
    console.log(this.course);
  }

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

    return this.lectures.filter(
      (lecture: Lecture) => lecture.id == this.idItem
    )[0];
  }
  getVideoInfo(lectureId: string) {
    let urlGetVideo = this.baseURL + 'lectures/' + lectureId + '/video';
    console.log(urlGetVideo);
    return this.http.get<{ message: string; count: number; video: Video }>(
      urlGetVideo,
      httpOptions
    );
  }
  setItemIndex(index:number){
    this.itemIndex=index;
  }
  setVideoDuration(duration: number) {
    let urlUpdateVideo =
      this.baseURL + 'lectures/' + this.idItem + '/video/length';
    return this.http.put<{ message: string; count: number; video: Video }>(
      urlUpdateVideo,
      { length: duration },
      httpOptions
    );
  }
  setCourses(listCourse: Course[]) {
    this.courses = listCourse;
  }
  getSectionSelection() {
    console.log('section ID' + this.idItem);
    return this.sections.filter((section) => section.id == this.idItem);
  }
  getCurrentSelection(): Observable<VideoType> {
    return this.sbjTypeSelection.asObservable();
  }
  getWayModify() {
    return this.sbjWayModify.asObservable();
  }
  getSbjSectionDummy() {
    return this.sbjSectionDummy.asObservable();
  }
  getSbjCreateCourse() {
    return this.sbjCreateCourse.asObservable();
  }
  getSbjIsFinish() {
    return this.sbjStatus.asObservable();
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
    this.sbjIdItem.next(this.idItem);

    this.typeSelection = type;
    this.sbjTypeSelection.next(this.typeSelection);

    this.wayModify = way;
    this.sbjWayModify.next(this.wayModify);
  }
  setIdCourse(id: string) {
    this.idCourse = id;
  }
  setIsFinish(status: number) {
    this.status = status;
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
    // let sectionUp: Section = this.getSectionSelection()[0];
    // if (sectionUp.id == this.sections[0].id) {
    //   console.log('Can not up this section');
    //   return this.onSaveSection(sectionUp);
    // }
  
    // let sectionSwap = new Section();
    // for (let i = 0; i < this.sections.length - 1; i++) {
    //   if (this.sections[i + 1].id == sectionUp.id) {
    //     sectionSwap = this.sections[i];
    //   }
    // }
    // //find swap lecture
    // // let lectureSwap: Lecture[] = this.lectures.filter((lecture) => {
    // //   return lecture.sectionId == sectionSwap.id;
    // // });
    // // let lectureUp: Lecture[] = this.lectures.filter((lecture) => {
    // //   return lecture.sectionId == sectionUp.id;
    // // });
    // //Just change lectureOrder when both section have lecture
    // // if(lectureUp.length>0 && lectureSwap.length>0){
    // //   let startSwap =
    // //   lectureUp[lectureUp.length - 1].lectureOrder - lectureSwap.length + 1;

    // // let startUp = lectureSwap[0].lectureOrder;
    // //Update lecture in side

    // // for (let s = 0; s < lectureSwap.length; s++) {
    // //   lectureSwap[s].lectureOrder = startSwap + s;
    // //   this.onSaveLecture(lectureSwap[s]);
    // // }
    // // for (let u = 0; u < lectureUp.length; u++) {
    // //   lectureUp[u].lectureOrder = startUp + u;
    // //   this.onSaveLecture(lectureUp[u]);
    // // }
    // // }

    // // lectureUp.forEach((lecture) => {
    // //   lecture.lectureOrder = lecture.lectureOrder - lectureSwap.length;
    // //   this.onSaveLecture(lecture);
    // // });

    // //Update case: different section
    // let tmpOrder = sectionSwap.sectionOrder;
    // sectionSwap.sectionOrder = sectionUp.sectionOrder;
    // this.onSaveSection(sectionSwap);

    // sectionUp.sectionOrder = tmpOrder;
    // return this.onSaveSection(sectionUp);
    console.log(httpOptions);
    let urlUpSection=this.baseURL+"sections/"+ this.idItem+ "/up"
    return this.http.put<{message:string}>(urlUpSection, {} ,httpOptions);
  }
  onDownSection() {
    let urlDownSection=this.baseURL+"sections/"+ this.idItem+ "/down"
    return this.http.put<{message:StringConstructor}>(urlDownSection,{} ,httpOptions);

  }
  onUpLecture() {
    
    let urlUpLecture=this.baseURL+"lectures/"+this.idItem+"/up";
    let lectureUp: Lecture = this.getLectureSelection();
    let sectionId = "0";
    if( this.listDeepSection[0].lecture.length>0 && 
        this.listDeepSection[0].lecture[0].id == lectureUp.id){
          this.status = 200;
          this.sbjStatus.next(this.status);
          return;
        }
    for(let i=0; i< this.listDeepSection.length;i++){
      if(this.listDeepSection[i].section_id== lectureUp.sectionId){
     
          if(this.listDeepSection[i].lecture[0].id == lectureUp.id ){
            sectionId= this.listDeepSection[i-1].section_id;
          }
          else
          {
            sectionId= lectureUp.sectionId;
          }
      }
    }

    this.http.put<{ message: StringConstructor}>(
      urlUpLecture,
      {
        sectionId: sectionId,
      },
      httpOptions
    ).toPromise().then(response=>{
      this.status = 200;
      this.sbjStatus.next(this.status);
      return;
    }).catch(error=>{
      this.status = 500;
      this.sbjStatus.next(this.status);
      return;
    })
    // let lectureUp: Lecture = this.getLectureSelection();
    // //Don't run anything if the first lession
    // if ( this.listDeepSection[0].lecture.length>0 && 
    //   lectureUp.id == this.listDeepSection[0].lecture[0].id) {
    //   if (this.listDeepSection[0].lecture[0].id == lectureUp.id) {
    //     console.log('Lession can not up' + lectureUp);
    //     return this.onSaveLecture(lectureUp);
    //   }
    //   //CASE: When the first lecture is not of one's section
    //   for (let i = 1; i < this.sections.length - 1; i++) {
    //     if (this.sections[i].id === lectureUp.sectionId) {
    //       lectureUp.sectionId = this.sections[i - 1].id;
    //       return this.onSaveLecture(lectureUp);
    //     }
    //   }
    // }
    // let lectureSwap = new Lecture();

    // for (let i = 0; i < this.listDeepSection.length; i++) {
    //   for (let j = 0; j < this.listDeepSection[i].lecture.length; j++) {
    //     if (j == this.listDeepSection[i].lecture.length - 1) {
    //       //CASE: in diffference section
    //       if (
    //         i + 1 < this.listDeepSection.length &&
    //         this.listDeepSection[i + 1].lecture.length > 0 &&
    //         this.listDeepSection[i + 1].lecture[0].id == lectureUp.id
    //       ) {
    //         lectureSwap = this.listDeepSection[i].lecture[j];
    //       }
    //     } else if (this.listDeepSection[i].lecture[j + 1].id == lectureUp.id) {
    //       lectureSwap = this.listDeepSection[i].lecture[j];
    //     }
    //   }
    // }

    // // for (let i = 0; i < len; i++) {
    // //   if (this.lectures[i + 1].id == lectureUp.id) {
    // //     lectureSwap = this.lectures[i];
    // //   }
    // // }

    // //Case: Emty lecture above
    // if (!lectureSwap.sectionId) {
    //   for (let i = 0; i < this.sections.length - 1; i++) {
    //     if (this.sections[i + 1].id === lectureUp.sectionId) {
    //       lectureUp.sectionId = this.sections[i].id;
    //       return this.onSaveLecture(lectureUp);
    //     }
    //   }
    // }
    // //Swap lecture in difference section
    // if (lectureSwap.sectionId != lectureUp.sectionId) {
    //   let sectionUpId = lectureUp.sectionId;
    //   lectureUp.sectionId = lectureSwap.sectionId;
    //   lectureSwap.sectionId = sectionUpId;
    //   this.onSaveLecture(lectureSwap)
    //     .toPromise()
    //     .then((response) => {
    //       return this.onSaveLecture(lectureUp);
    //     });
    // }
    // //Comon case
    // let tmpOrder = lectureSwap.lectureOrder;
    // lectureSwap.lectureOrder = lectureUp.lectureOrder;
    // this.onSaveLecture(lectureSwap);
    // lectureUp.lectureOrder = tmpOrder;
    // return this.onSaveLecture(lectureUp);
  }

  onDownLecture() {

    let urlDownLecture=this.baseURL+"lectures/"+this.idItem+"/down";
    let lectureDown: Lecture = this.getLectureSelection();
    let sectionId = "0";
    for(let i=0; i< this.listDeepSection.length; i++){
        if(this.listDeepSection[i].section_id== lectureDown.sectionId ){
          if(i == (this.listDeepSection.length-1) && 
          this.itemIndex == (this.listDeepSection[i].lecture.length-1))
          { 
            this.status = 200;
            this.sbjStatus.next(this.status);
            return;
          } 
          else if (this.itemIndex == (this.listDeepSection[i].lecture.length-1))
          {
            sectionId= this.listDeepSection[i+1].section_id;
          }
          else {
            sectionId= this.listDeepSection[i].section_id;
          }
        }
    }
    this.http.put<{ message: string}>(
      urlDownLecture,
      {
        sectionId: sectionId,
      },
      httpOptions
    ).toPromise().then(response=>{
      this.status = 200;
      this.sbjStatus.next(this.status);
      return;
    }).catch(error=>{
      this.status = 500;
      this.sbjStatus.next(this.status);
      return;
    })
    // let lectureDown: Lecture = this.getLectureSelection();
    // let maxLenDummy= this.listDeepSection.length-1;
    // if (this.listDeepSection[maxLenDummy].lecture.length>0 && 
    //    lectureDown.id === this.listDeepSection[maxLenDummy].lecture[this.listDeepSection[maxLenDummy].lecture.length-1].id) 
    //   //Case: as section empty below
    //   {
    //     console.log('Can not down this lecture' + lectureDown);
    //     this.status = 200;
    //     this.sbjStatus.next(this.status);
    //     return;
    //   }

    //   for (let i = 0; i < this.sections.length - 1; i++) {
    //     if (this.sections[i].id === lectureDown.sectionId) {
    //       lectureDown.sectionId = this.sections[i + 1].id;
    //       this.onSaveLecture(lectureDown).subscribe((response) => {
    //         if (response.count > 0) {
    //           this.status = 200;
    //           this.sbjStatus.next(this.status);
    //         } else {
    //           this.status = 400;
    //           this.sbjStatus.next(this.status);
    //         }
    //         return;
    //       });
    //     }
    //   }
   
    // let lectureSwapDown = new Lecture();
    // // let len = this.lectures.length - 1;
    // // for (let i = len; i >= 1; i--) {
    // //   if (this.lectures[i - 1].id == lectureDown.id) {
    // //     lectureSwapDown = this.lectures[i];
    // //   }
    // // }

    // for (let i = 0; i < this.listDeepSection.length; i++) {
    //   for (let j = 0; j < this.listDeepSection[i].lecture.length; j++) {
    //     if (this.listDeepSection[i].lecture[j].id == lectureDown.id) {
    //       if (j == this.listDeepSection[i].lecture.length - 1) {
    //         //CASE: in diffference section
    //         if (
    //           i + 1 < this.listDeepSection.length &&
    //           this.listDeepSection[i + 1].lecture.length > 0
    //         ) {
    //           lectureSwapDown = this.listDeepSection[i + 1].lecture[0];
    //         }
    //       } else {
    //         lectureSwapDown = this.listDeepSection[i].lecture[j + 1];
    //       }
    //     }
    //   }
    // }

    // if (!lectureSwapDown.sectionId) {
    //   for (let i = 0; i < this.sections.length - 1; i++) {
    //     if (this.sections[i].id == lectureDown.sectionId) {
    //       lectureDown.sectionId = this.sections[i + 1].id;
    //       this.onSaveLecture(lectureDown).subscribe((response) => {
    //         if (response.count > 0) {
    //           this.status = 200;
    //           this.sbjStatus.next(this.status);
    //         } else {
    //           this.status = 400;
    //           this.sbjStatus.next(this.status);
    //         }
    //         return;
    //       });
    //     }
    //   }
    // }
    // //CASE: diffirence section
    // if (lectureSwapDown.sectionId !== lectureDown.sectionId) {
    //   lectureDown.sectionId = lectureSwapDown.sectionId;
    //   this.onSaveLecture(lectureDown).subscribe((response) => {
    //     if (response.count > 0) {
    //       this.status = 200;
    //       this.sbjStatus.next(this.status);
    //     } else {
    //       this.status = 400;
    //       this.sbjStatus.next(this.status);
    //     }
    //     return;
    //   });
    // }

    // let tmpOrder = lectureSwapDown.lectureOrder;
    // lectureSwapDown.lectureOrder = lectureDown.lectureOrder;
    // this.onSaveLecture(lectureSwapDown).subscribe((response) => {
    //   lectureDown.lectureOrder = tmpOrder;
    //   this.onSaveLecture(lectureDown).subscribe((response) => {
    //     if (response.count > 0) {
    //       this.status = 200;
    //       this.sbjStatus.next(this.status);
    //     } else {
    //       this.status = 400;
    //       this.sbjStatus.next(this.status);
    //     }
    //     return;
    //   });
    // });

    // lectureDown.lectureOrder = tmpOrder;
    // return this.onSaveLecture(lectureDown);
  }

  //================ HTTP ===============
  private apiUrlCourse = this.baseURL + 'courses';
  private apiUrlSection = this.baseURL + 'sections';
  private apiUrlLecture = this.baseURL + 'lectures';
  initCourses() {
    console.log('find course');
    return this.http.get<{ message: string; count: number; courses: Course[] }>(
      this.apiUrlCourse
    );
    //  .subscribe(response=>{
    //    this.courses= response.courses;
    //    console.log(response);
    //    listCourses=response.courses;
    //  })
    // return of(this.mcourses);
  }
  getCourses() {
    return this.courses;
  }
  getData() {
    // this.lectures = [];
    // this.sections = [];
    // this.listDeepSection = [];
    // let apiGetLectureOfCourse =
    //   this.apiUrlCourse + '/' + this.idCourse + '/lectures';
    // this.http
    //   .get<{ message: string; count: number; sections: Section[] }>(
    //     this.apiUrlSection,
    //     {
    //       headers: this.headers,
    //       params: new HttpParams().set('courseId', this.idCourse),
    //     }
    //   )
    //   .toPromise()
    //   .then((response) => {
    //     this.sections = response.sections.sort((s1, s2) => {
    //       if (s1.sectionOrder > s2.sectionOrder) return 1;
    //       if (s1.sectionOrder < s2.sectionOrder) return -1;
    //       return 0;
    //     });
    //     console.log(this.sections);
    //     console.log(response.sections);
    //     //get section
    //     this.http
    //       .get<{ message: string; count: number; lectures: Lecture[] }>(
    //         apiGetLectureOfCourse,
    //         {
    //           headers: this.headers,
    //           // params: new HttpParams().set('courseId', this.idCourse),
    //         }
    //       )
    //       .toPromise()
    //       .then((response) => {
    //         this.lectures = response.lectures;
    //         for(let i=0; i< this.lectures.length; i++){
              
    //         }

    //         this.sections.forEach((section) => {
    //           console.log(section.id);
    //           let tmpLectures: Lecture[] = [];
    //           tmpLectures = this.lectures
    //             .filter((lecture) => lecture.sectionId == section.id)
    //             .sort((l1, l2) => {
    //               if (l1.lectureOrder > l2.lectureOrder) {
    //                 return 1;
    //               }
    //               if (l1.lectureOrder < l2.lectureOrder) return -1;

    //               return 0;
    //             });

    //           console.log('Lecture array ne');

    //           this.listDeepSection.push(
    //             new SectionDummy(section.id, section.title, tmpLectures)
    //           );
    //         });
    //         console.log('Dummy');
    //         this.sbjSectionDummy.next(this.listDeepSection);
    //         console.log(this.listDeepSection);
    //       })
    //       .catch((error) => {
    //         this.sections = this.sections.sort((s1, s2) => {
    //           if (s1.sectionOrder > s2.sectionOrder) return 1;
    //           if (s1.sectionOrder < s2.sectionOrder) return -1;
    //           return 0;
    //         });
    //         this.sections.forEach((section) => {
    //           this.listDeepSection.push(
    //             new SectionDummy(section.id, section.title, [])
    //           );
    //         });
    //         this.sbjSectionDummy.next(this.listDeepSection);
    //       });
    //   })
    //   .catch((error) => {
    //     this.sbjSectionDummy.next(this.listDeepSection);
    //   });

    this.sections= this.mSectionList;
    this.lectures= this.mLectureList;
    this.videos= this.mVideo;

        this.sections.forEach((section) => {
          // console.log(section);
           let tmpLecturers: Lecture[] = this.lectures.filter(
             lecture => lecture.sectionId == section.id
           );
          // console.log(tmpLecturers);
           this.listDeepSection.push(
             new SectionDummy(section.id, section.title, tmpLecturers)
           );
           this.sbjSectionDummy.next(this.listDeepSection);
    })
  }
  getLectures(): Observable<Lecture[]> {
    this.http
      .get<{ message: string; count: number; lectures: Lecture[] }>(
        this.apiUrlLecture
      )
      .subscribe((response) => {
        return response.lectures;
      });
    return of(this.lectures);
  }
  getSectionDummy() {
    return this.listDeepSection;
  }
  getLectureVideo(idLecture: string) {
    //Tmp
    return this.http.get<{
      message: string;
      count: number;
      lectures: Lecture[];
    }>(this.apiUrlLecture);
  }
  getTitleContent() {
    console.log(this.idItem);
    let title = '';
    if (this.typeSelection == VideoType.section) {
      this.sections.forEach((section) => {
        if (section.id == this.idItem) {
          title = section.title;
        }
      });
    } else {
      this.lectures.forEach((lecturer) => {
        if (lecturer.id == this.idItem) {
          title = lecturer.title;
        }
      });
    }
    return title;
  }
  setIdCourseSelection(idCourse: string) {
    this.idCourse = idCourse;
    this.courses.forEach((mCourse) => {
      if (mCourse.id == idCourse) {
        this.course = mCourse;
      }
    });
  }
  setCourse(course: Course) {
    this.course.title = course.title;
    this.course.grade = course.grade;
    this.course.courseType = course.courseType;
    this.course.courseDescription = course.courseDescription;
    //TODO: url find where
    this.course.thumbnailUrl = course.thumbnailUrl;
  }


  handleCreateLecture(title: string) {
    let tmpLecture = new Lecture();
    //TODO: add more about File Video
    tmpLecture.title = title;

    tmpLecture.sectionId = this.getSectionSelection()[0].id;
    console.log('sectio select');
    console.log(tmpLecture.sectionId);
    tmpLecture.isHidden = false;
    // let fromOrder = this.lectures.length - 1;
    // for (let i = 0; i < this.listDeepSection.length; i++) {
    //   if (this.listDeepSection[i].section_id == tmpLecture.sectionId) {
    //     if (this.listDeepSection[i].lecture.length > 0) {
    //       tmpLecture.lectureOrder =
    //         this.listDeepSection[i].lecture[
    //           this.listDeepSection[i].lecture.length - 1
    //         ].lectureOrder + 1;
    //     } else {
    //       //Case: when dosen't has any lecture in this course, it make listDeepSection.lecture is null
    //       if (this.lectures.length <= 0) {
    //         tmpLecture.lectureOrder = 0;
    //         this.onCreateLecture(tmpLecture);
    //         return;
    //       }
    //       tmpLecture.lectureOrder =
    //         this.listDeepSection[i - 1].lecture[
    //           this.listDeepSection[i - 1].lecture.length - 1
    //         ].lectureOrder + 1;
    //     }
    //   }
    // }
    // for (let j = 0; j < this.lectures.length; j++) {
    //   if (this.lectures[j].lectureOrder == tmpLecture.lectureOrder - 1) {
    //     fromOrder = j;
    //   }
    // }
    // for (let k = fromOrder + 1; k < this.lectures.length; k++) {
    //   this.lectures[k].lectureOrder = this.lectures[k].lectureOrder + 1;
    //   this.onSaveLecture(this.lectures[k]);
    // }
    return this.onCreateLecture(tmpLecture);
  }
  handleEditTitleLecture(title: string) {
    var tmpLecturer = this.getLectureSelection();

    tmpLecturer.title = title;
    return this.onSaveLecture(tmpLecturer);
  }
  handleEditSection(title: string) {
    var tmpSection = this.getSectionSelection()[0];
    console.log(tmpSection);

    tmpSection.title = title;
    return this.onSaveSection(tmpSection);
  }
  handleCreateSection(title: string) {
    let tmpSection = new Section();
    tmpSection.title = title;
    tmpSection.courseId = this.idCourse;
    tmpSection.isHidden = false;

    if (this.sections.length > 0) {
      tmpSection.sectionOrder =
        this.sections[this.sections.length - 1].sectionOrder + 1;
    } else {
      tmpSection.sectionOrder = 0;
    }
    console.log('Section new');
    console.log(tmpSection);
    return this.onCreateSection(tmpSection);
  }

  handleUpdateWithThumbnail(file: File) {
    // const file = new FormData();
    // file.set('file', imgFile);

    console.log('Upload Thumbnail');
    console.log(file);
    let url = this.baseURL + '/thumbnail/' + this.course.id;
    this.http.post(url, file).subscribe((response) => {
      console.log('response');
    });

    const fileId = new Date().getTime().toString();
    const chunkSize = 5 * 1024 * 1024;
    const chunksQuantity = Math.ceil(file.size / chunkSize);
    const chunksQueue = [...Array(chunksQuantity)]
      .map((_, index) => index)
      .reverse();

    const upload = (chunk: Blob, chunkId: number) => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('post', `${this.baseURL}courses/${this.idCourse}/thumbnail`);

        xhr.setRequestHeader('Content-Type', 'application/octet-stream');
        xhr.setRequestHeader('X-Chunk-Id', String(chunkId));
        xhr.setRequestHeader('X-Content-Id', fileId);
        xhr.setRequestHeader('X-Chunk-Length', String(chunk.size));
        xhr.setRequestHeader('X-Content-Length', String(file.size));
        xhr.setRequestHeader('X-Content-Name', file.name);
        xhr.setRequestHeader('X-Chunks-Quantity', String(chunksQuantity));

        // Set token to request header
        xhr.setRequestHeader(
          'Authorization',
          `Bearer ` + localStorage.getItem('token')
        );

        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            resolve({ status: 200, data: JSON.parse(this.responseText) });
          }
          if (xhr.readyState === 4 && xhr.status === 201) {
            resolve({ status: 201, data: JSON.parse(this.responseText) });
          }
        };

        xhr.onerror = reject;

        xhr.send(chunk);
      });
    };

    const sendNext = () => {
      if (!chunksQueue.length) {
        console.log('All parts uploaded');

        return;
      }
      const chunkId = chunksQueue.pop();
      const begin = chunkId! * chunkSize;
      const chunk = file.slice(begin, begin + chunkSize);

      upload(chunk, chunkId!)
        .then((res) => {
          const castedData = res as {
            status: number;
            data: { [index: string]: string };
          };
          if (castedData.status === 201) {
            console.log(castedData.data);
            console.log('***', 'Upload successfully');
          }

          sendNext();
        })
        .catch(() => {
          chunksQueue.push(chunkId!);
        });
    };

    sendNext();
  }
  handleUpdateWithVideo(file: File, duration: number) {
    console.log('hi');
    const fileId = new Date().getTime().toString();
    const chunkSize = 5 * 1024 * 1024;
    const chunksQuantity = Math.ceil(file.size / chunkSize);
    const chunksQueue = [...Array(chunksQuantity)]
      .map((_, index) => index)
      .reverse();

    const upload = (chunk: Blob, chunkId: number) => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(
          'post',
          `https://us-central1-supple-craft-318515.cloudfunctions.net/app/api/lectures/${this.idItem}/video/upload`
        );

        xhr.setRequestHeader('Content-Type', 'application/octet-stream');
        xhr.setRequestHeader('X-Chunk-Id', String(chunkId));
        xhr.setRequestHeader('X-Content-Id', fileId);
        xhr.setRequestHeader('X-Chunk-Length', String(chunk.size));
        xhr.setRequestHeader('X-Content-Length', String(file.size));
        xhr.setRequestHeader('X-Content-Name', file.name);
        xhr.setRequestHeader('X-Chunks-Quantity', String(chunksQuantity));

        // Set token to request header
        xhr.setRequestHeader('Authorization', `Bearer ${this.idToken}`);

        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            resolve({ status: 200, data: JSON.parse(this.responseText) });
          }
          if (xhr.readyState === 4 && xhr.status === 201) {
            resolve({ status: 201, data: JSON.parse(this.responseText) });
          }
        };

        xhr.onerror = reject;

        xhr.send(chunk);
      });
    };

    let response;
    const sendNext = () => {
      if (!chunksQueue.length) {
        console.log('All parts uploaded');

        return;
      }
      const chunkId = chunksQueue.pop();
      const begin = chunkId! * chunkSize;
      const chunk = file.slice(begin, begin + chunkSize);

      upload(chunk, chunkId!)
        .then((res) => {
          const castedData = res as {
            status: number;
            data: { [index: string]: string };
          };
          if (castedData.status === 201) {
            console.log(castedData.data);
            this.setVideoDuration(duration).subscribe(
              (response) => {
                console.log(duration);
              },
              (error) => {
                console.log(error.message);
              }
            );
          }

          sendNext();
        })
        .catch(() => {
          chunksQueue.push(chunkId!);
        });
    };

    sendNext();
  }

  findLastLectureOfSection() {
    let lastLecture = -1;
    for (let i = this.lectures.length - 1; i >= 0; i--) {
      if (this.lectures[i].sectionId === this.idItem) {
        lastLecture = i;
      }
    }
    return lastLecture;
  }
  updateLectureBelow(from: number) {
    for (let i = from; i < this.lectures.length; i++) {
      this.lectures[i].lectureOrder++;
      this.onSaveLecture(this.lectures[i]);
    }
  }
  createCourse() {
    this.sections = [];
    this.lectures = [];
    return this.onCreateCourse(this.course);
  }
  onSaveSection(
    section: Section
  ): Observable<{ message: String; count: Number; section: Section }> {
    //TODO: Http

    console.log('Save section ');
    console.log(section);
    const url = `${this.apiUrlSection}/${section.id}`;

    return this.http.put<{ message: string; count: number; section: Section }>(
      url,
      {
        title: section.title,
        courseId: section.courseId,
        sectionOrder: section.sectionOrder,
        isHidden: section.isHidden,
      },
      httpOptions
    );
    // .subscribe((response) => {
    //   console.log(response);
    // });

    // this.mSectionList.forEach((dataSection)=>{
    //     if(dataSection.id== sectionId){
    //       dataSection.title=section.title;
    //     }
    // })
  }

  onSaveLecture(lecture: Lecture) {
    //TODO: Http
    console.log('Save lecturer ');
    console.log(lecture);
    const url = `${this.apiUrlLecture}/${lecture.id}`;
    console.log(url);
    console.log(lecture);
    // return this.http.put<Lecture>(url, lecturer, httpOptions);
    return this.http.put<{ message: string; count: number; lecture: Lecture }>(
      url,
      {
        id: lecture.id,
        title: lecture.title,
        lectureOrder: lecture.lectureOrder,

        isHidden: lecture.isHidden,
        sectionId: lecture.sectionId,
      },
      httpOptions
    );
    // .subscribe((response) => {
    //   console.log('hhsjdsd');
    //   console.log(response);
    //   return response.lecture;
    // });
  }
  onSaveCourse() {
    //TODO: Http
    console.log('Save Course ');
    console.log(this.course);
    const url = `${this.apiUrlCourse}/${this.course.id}`;
    // this.http.put<{message:String, count:Number, course:Course}>(url, this.course, httpOptions);

    return this.http.put<{ message: String; count: Number; course: Course }>(
      url,
      {
        id: this.course.id,
        title: this.course.title,
        courseDescription: this.course.courseDescription,
        price: this.course.price,
        courseType: this.course.courseType,
        thumbnailUrl: this.course.thumbnailUrl,
        isHidden: this.course.isHidden,
        grade: this.course.grade,
      },
      httpOptions
    );
  }
  onDeleteSection() {
    //TODO: Http
    const url = `${this.apiUrlSection}/${this.idItem}`;
    return this.http.delete<{ message: any }>(url, httpOptions);

    // .subscribe((response) => {
    //   console.log(response.message);
    //   console.log('Delete Section :' + this.idItem);
    // });
  }
  onDeleteCourse() {
    //TODO: Httpf
    const url = `${this.apiUrlCourse}/${this.idCourse}`;
    return this.http.delete<{ message: string }>(url, httpOptions);
    // .subscribe((response) => {
    //   console.log(response.message);
    //   console.log('Delete Course :' + this.idItem);
    // });
  }
  onDeleteLecture() {
    //TODO: Http
    const url = `${this.apiUrlLecture}/${this.idItem}`;
    console.log('delete');
    console.log(url);
    return this.http.delete<{ message: string }>(url, httpOptions);
    // .subscribe((response) => {
    //   console.log(response.message);
    //   console.log('Delete Section :' + this.idItem);
    // });
  }
  onCreateSection(section: Section) {
    // const requestOptions: HttpHeaders = { headers: this.authHeader };
    this.sbjCreateCourse.next(this.course);
    return this.http.post<{ message: String; count: Number; section: Section }>(
      this.apiUrlSection,
      {
        title: section.title,
        courseId: section.courseId,
        sectionOrder: section.sectionOrder,
        isHidden: section.isHidden,
        createdAt: section.createdAt,
        updatedAt: section.updatedAt,
      },
      httpOptions
    );

    // .subscribe((response) => {
    //   if (response.count > 0) {
    //   }
    //   console.log(response);
    // });
  }

  onCreateCourse(course: Course) {
    console.log('Create course ' + course.title);
    //Course default
    let courseDefault: Course = {
      id: '',
      title: 'Default title',
      courseDescription: 'description for this course',
      price: 0,
      courseType: COURSE_TYPE.THEORY,
      grade: GRADES.TWELFTH,
      thumbnailUrl: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      isHidden: false,
    };
    //Create new Course
    return this.http
      .post<{ message: string; count: number; course: Course }>(
        this.apiUrlCourse,
        {
          title: courseDefault.title,
          courseDescription: courseDefault.courseDescription,
          price: courseDefault.price,
          courseType: courseDefault.courseType,
          thumbnailUrl: courseDefault.thumbnailUrl,
          isHidden: courseDefault.isHidden,
          createdAt: courseDefault.createdAt,
          updatedAt: courseDefault.updatedAt,
        },
        httpOptions
      )
      .subscribe((response) => {
        if (course) {
          this.course = response.course;
          this.idCourse = this.course.id;
          console.log('Id COurse');
          console.log(this.idCourse);
          let firstSection: Section = new Section();
          firstSection.title = 'Section 1';
          firstSection.courseId = course.id;
          firstSection.sectionOrder = 0;
          this.onCreateSection(firstSection);
          this.initCourses();
        }
      });
  }
  onCreateLecture(lecture: Lecture) {
    console.log('Create lecturer ' + lecture.title);
    console.log(lecture);
    console.log(this.idCourse);
    return this.http.post<{ message: String; count: Number; lecture: Lecture }>(
      this.apiUrlLecture,
      {
        courseId: this.idCourse,
        title: lecture.title,
        sectionId: lecture.sectionId,
        lectureOrder: lecture.lectureOrder,
      },
      httpOptions
    );
    // .subscribe((response) => {
    //   console.log(response);
    // });
  }
  //=============== Create HTTP===================

  //================ Mockup data ==================
  private mcourses: Course[] = [
    {
      id: '1',
      title: 'Giải phương trình bậc 3',
      courseDescription: 'Description',
      price: 150000,
      courseType: COURSE_TYPE.THEORY,
      grade: GRADES.TENTH,
      thumbnailUrl: 'string',
      createdAt: new Date(),
      updatedAt: new Date(),
      isHidden: false,
    },
  ];
  private mSectionList: Section[] = [
    {
      courseId: '1',
      id: 'course1sec1',
      title: 'Lý thuyết phương trình',
      isHidden: false,
      sectionOrder: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      courseId: '1',
      id: 'course1sec2',
      title: 'Phương trình tuyến tính',
      isHidden: false,
      sectionOrder: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  private mLectureList: Lecture[] = [
    {
      id: 'co1sec1lec1',
      title: 'Video 1',
      lectureOrder: 0,
      isHidden: false,
      sectionId: 'course1sec1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'co1sec1lec2',
      title: 'Video 2',
      lectureOrder: 1,
      isHidden: false,
      sectionId: 'course1sec1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'co1sec2lec1',
      title: 'Video 1',
      lectureOrder: 2,
      isHidden: false,
      sectionId: 'course1sec2',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'co1sec2lec2',
      title: 'Video 2',
      lectureOrder: 3,
      isHidden: false,
      sectionId: 'course1sec2',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'co1sec2lec3',
      title: 'Video 3',
      lectureOrder: 4,
      isHidden: false,
      sectionId: 'course1sec2',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  private mVideo: Video[] = [
    {
      id: 'lec0',
      fileName: 'Video of lecture 0',
      length: 134,
      lectureId: 'co1sec1lec1',
      createdAt: new Date(),
      updatedAt: new Date(),
      isHidden: false,
    },
    {
      id: 'lec1',
      fileName: 'Video of lecture 1',
      length: 130,
      lectureId: 'co1sec1lec2',
      createdAt: new Date(),
      updatedAt: new Date(),
      isHidden: false,
    },
    {
      id: 'lec2',
      fileName: 'Video of lecture 2',
      length: 0,
      lectureId: 'co1sec2lec1',
      createdAt: new Date(),
      updatedAt: new Date(),
      isHidden: false,
    },
    {
      id: 'lec3',
      fileName: 'Video of lecture 3',
      length: 0,
      lectureId: 'co1sec2lec2',
      createdAt: new Date(),
      updatedAt: new Date(),
      isHidden: false,
    },
    {
      id: 'lec4',
      fileName: 'Video of lecture 4',
      length: 0,
      lectureId: 'co1sec2lec3',
      createdAt: new Date(),
      updatedAt: new Date(),
      isHidden: false,
    },
  ];
}
