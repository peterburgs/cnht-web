import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, of, Subject, Subscription } from 'rxjs';
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

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer '+localStorage.getItem('token'),
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
    courseDescription: 'description for this course',
    price: 0,
    courseType: COURSE_TYPE.THEORY,
    grade: GRADES.TWELFTH,
    thumbnailUrl: '../../../assets/images/img1.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
    isHidden: false,
  };
  private fileThumbnail: File = new File([], 'thumbnail-default');
  private sections: Section[] = [];
  private lectures: Lecture[] = [];
  private courses: Course[] = [];
  private listDeepSection:SectionDummy[] = [];
  private videos: Video[] = [];
  private baseURL =
    'https://us-central1-supple-craft-318515.cloudfunctions.net/app/api/';
  private authHeader = new HttpHeaders();
  private idToken=localStorage.getItem('token');
    
  //================================= Initial =========================
  //save edit Modal in screen

  idItem: string = 'default';
  isValid = true;
  idCourse: string = 'default';
  wayModify = ModifyType.new;
  typeSelection = VideoType.lession;
  invokeNotifyModal = new EventEmitter();
  invokeValidModal = new EventEmitter();
  subsEdit?: Subscription;
  subsDelete?: Subscription;
  subsValid?: Subscription;
  //====== Subject observable
  sbjTypeSelection = new Subject<VideoType>();
  sbjWayModify = new Subject<ModifyType>();
  sbjIdItem = new Subject<string>();
  headers: HttpHeaders = new HttpHeaders();


  constructor(private http: HttpClient) {
    
    this.idToken= localStorage.getItem('token');
    // this.initCourses();
    this.authHeader.append( 'Content-Type', 'application/json');
    this.authHeader.append('Authorization', 'Bearer ' + this.idToken);

    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer' + this.idToken,
    });
  }

  //================================= GET =========================
  setCourseSelection() {
    console.log(this.idCourse);
   this.courses.forEach(
      (mCourse) => 
      {
       console.log(mCourse.id);
       if (mCourse.id == this.idCourse){
          console.log(mCourse);
          this.course= mCourse;
       }}
      
    );
    console.log('Thao')
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
  setCourses(listCourse: Course[]){
    this.courses= listCourse;
  }
  getSectionSelection() {
    return this.sections.filter((section) => section.id == this.idItem);
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
    let sectionUp: Section = this.getSectionSelection()[0];
    if (sectionUp.sectionOrder <= 0) {
      console.log('Can not up this section');
      return;
    }
    // Find section above
    //   let sectionSwap: Section=this.sections
    //   .filter(section=>section.sectionOrder===(sectionUp.sectionOrder-1))[0];
    // sectionSwap.sectionOrder=sectionUp.sectionOrder;
    let sectionSwap = new Section();
    for (let i = 0; i < this.sections.length - 1; i++) {
      if (this.sections[i + 1].id == sectionUp.id) {
        sectionSwap = this.sections[i];
      }
    }
    //Update case: different section
    let tmpOrder = sectionSwap.sectionOrder;
    sectionSwap.sectionOrder = sectionUp.sectionOrder;
    this.onSaveSection(sectionSwap);

    sectionUp.sectionOrder = tmpOrder;
    this.onSaveSection(sectionUp);

    // console.log('First section swap up'+sectionSwap);
    // this.onSaveSection(sectionSwap);

    // sectionUp.sectionOrder=sectionUp.sectionOrder-1;
    // this.onSaveSection( sectionUp);
    // console.log('Section section swap up'+sectionUp);
  }
  onDownSection() {
    let sectionDown: Section = this.getSectionSelection()[0];
    //Last section canot down
    if (sectionDown.id == this.sections[this.sections.length - 1].id) {
      console.log('Can not down this section' + sectionDown);
      return;
    }
    let sectionSwap = new Section();
    //find the section below

    for (let i = this.sections.length - 1; i >= 1; i--) {
      if (this.sections[i - 1].id == sectionDown.id) {
        sectionSwap = this.sections[i];
      }
    }
    if (sectionSwap) {
      let tmpOrder = sectionSwap.sectionOrder;
      sectionSwap.sectionOrder = sectionDown.sectionOrder;

      this.onSaveSection(sectionSwap);

      sectionDown.sectionOrder = tmpOrder;
      this.onSaveSection(sectionDown);
    }
  }
  onUpLession() {
    let lectureUp: Lecture = this.getLectureSelection();
    //Don't run anything if the first lession
    if (lectureUp.id == this.lectures[0].id) {
      console.log('Lession can not up' + lectureUp);
      return;
    }
    let lectureSwap = new Lecture();
    let len = this.lectures.length - 1;
    for (let i = 0; i < len; i++) {
      if (this.lectures[i + 1].id == lectureUp.id) {
        lectureSwap = this.lectures[i];
      }
    }
    //Swap lecture in difference section
    if (lectureSwap.sectionId != lectureUp.sectionId) {
      lectureUp.sectionId = lectureSwap.sectionId;
      this.onSaveLecture(lectureUp);
      return;
    }
    //Comon case
    let tmpOrder = lectureSwap.lectureOrder;
    lectureSwap.lectureOrder = lectureUp.lectureOrder;
    this.onSaveLecture(lectureSwap);

    lectureUp.lectureOrder = tmpOrder;
    this.onSaveLecture(lectureUp);
  }

  onDownLession() {
    let lectureDown: Lecture = this.getLectureSelection();

    if (lectureDown.id == this.lectures[this.lectures.length - 1].id) {
      console.log('Can not down this lecture' + lectureDown);
      return;
    }
    let lectureSwapDown = new Lecture();
    let len = this.lectures.length - 1;
    for (let i = len; i >= 1; i++) {
      if (this.lectures[i - 1].id == lectureDown.id) {
        lectureSwapDown = this.lectures[i];
      }
    }
    if (lectureSwapDown.sectionId != lectureDown.sectionId) {
      lectureDown.sectionId = lectureSwapDown.sectionId;
      this.onSaveLecture(lectureDown);
      return;
    }
    let tmpOrder = lectureSwapDown.lectureOrder;
    lectureSwapDown.lectureOrder = lectureDown.lectureOrder;
    this.onSaveLecture(lectureSwapDown);

    lectureDown.lectureOrder = tmpOrder;
    this.onSaveLecture(lectureDown);
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
    this.lectures=[];
    this.sections=[];
    this.listDeepSection=[];
    let apiGetLectureOfCourse=this.apiUrlCourse+'/' +this.idCourse+"/lectures"
    this.http
      .get<{ message: string; count: number; sections: Section[] }>(
       this.apiUrlSection,
        {
          headers: this.headers,
          params: new HttpParams().set('courseId', this.idCourse),
        }
      )
      .subscribe((response) => {

        this.sections = response.sections;
        console.log(this.sections); 
        console.log(response.sections);
        //get section
        this.http
          .get<{ message: string; count: number; lectures: Lecture[] }>(
           apiGetLectureOfCourse,
            {
              headers: this.headers,
              // params: new HttpParams().set('courseId', this.idCourse),
            }
          )
          .subscribe((response) => {
            this.lectures = response.lectures;
            this.sections.forEach((section) => {
              console.log(section.id);
              let tmpLecturers: Lecture[] = this.lectures.filter(
                (lecture) => lecture.sectionId == section.id
              );
              console.log('Lecture array ne');
              console.log(tmpLecturers);
              this.listDeepSection.push(
                new SectionDummy(section.id, section.title, tmpLecturers)
              );
            });
          });
          
        console.log('Deep section');
        console.log(this.listDeepSection);
      });
    // this.sections= this.mSectionList;
    // this.lectures= this.mLectureList;
    // this.videos= this.mVideo;

    //     this.sections.forEach((section) => {
    //       // console.log(section);
    //        let tmpLecturers: Lecture[] = this.lectures.filter(
    //          lecture => lecture.sectionId == section.id
    //        );
    //       // console.log(tmpLecturers);
    //        this.listDeepSection.push(
    //          new SectionDummy(section.id, section.title, tmpLecturers)
    //        );
    // })

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
  getLectureVideo(idLecture: string){
    //Tmp
      return this.http
      .get<{ message: string; count: number; lectures: Lecture[] }>(
        this.apiUrlLecture
      );
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
  }
  setCourse(course: Course) {
    this.course.title = course.title;
    this.course.grade = course.grade;
    this.course.courseType = course.courseType;
    this.course.courseDescription = course.courseDescription;
    //TODO: url find where
    this.course.thumbnailUrl = course.thumbnailUrl;
  }
  
  getDataServe() {
    this.getData();
  }

  //Another
  handleUpate() {
    if (this.typeSelection == VideoType.course) {
      switch (this.wayModify) {
        case ModifyType.delete:
          this.onDeleteCourse();
          return;
        case ModifyType.save:
          this.onSaveCourse();
          return;
      }
    } else if (this.typeSelection == VideoType.section) {
      switch (this.wayModify) {
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
    } else if (this.typeSelection == VideoType.lession) {
      switch (this.wayModify) {
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
          this.onSaveSection(tmpSection);
        }
      }
    } else if (this.wayModify == ModifyType.new) {
      if (this.typeSelection == VideoType.section) {
        let tmpSection = new Section();
        tmpSection.title = title;
        tmpSection.courseId = this.idCourse
        tmpSection.isHidden = false;

        if(this.sections.length>0){
          tmpSection.sectionOrder =
          this.sections[this.sections.length - 1].sectionOrder + 1;
        }
        else{
          tmpSection.sectionOrder=0;
        }
        console.log('Section new')
        console.log(tmpSection);
        this.onCreateSection(tmpSection);
      } else if (this.typeSelection == VideoType.lession) {
        let tmpLecture = new Lecture();
        //TODO: add more about File Video
        tmpLecture.title = title;
       
        tmpLecture.sectionId = this.getSectionSelection()[0].id;
        console.log('Thanh ne');
        console.log(tmpLecture.sectionId)
        tmpLecture.idHidden = false;
        let fromOrder=-1;
        for(let i=0; i< this.listDeepSection.length; i++){
          if(this.listDeepSection[i].section_id==tmpLecture.sectionId){
            if(this.listDeepSection[i].lecture.length>0){
              tmpLecture.lectureOrder= this.listDeepSection[i].lecture[this.listDeepSection[i].lecture.length-1].lectureOrder+1;
             
            }
            else{
              tmpLecture.lectureOrder= this.listDeepSection[i-1].lecture[this.listDeepSection[i-1].lecture.length-1].lectureOrder+1;

            }
          }
        }
        for(let j=0; j< this.lectures.length; j++){
          if(this.lectures[j].sectionId== tmpLecture.sectionId){
            fromOrder=j;
          }
        }
        for(let k=fromOrder+1; k< this.lectures.length;k++){
          this.lectures[k].lectureOrder= this.lectures[k].lectureOrder+1;
            this.onCreateLecture(this.lectures[k]);
        }
        this.onCreateLecture(tmpLecture);
      }
    }
  }
  handleUpdateWithThumbnail(file: File) {
    // const file = new FormData();
    // file.set('file', imgFile);

    console.log('Upload Thumbnail');
    console.log(file);
    // let url= this.baseURL+'/thumbnail/'+this.course.id;
    // this.http.post(url, file).subscribe(response=>{
    //     console.log('response');
    // });

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
            "post",
            `${this.baseURL}courses/867d1a08-6150-4edf-a6a5-3613fa2954cc/thumbnail`
          );

          xhr.setRequestHeader("Content-Type", "application/octet-stream");
          xhr.setRequestHeader("X-Chunk-Id", String(chunkId));
          xhr.setRequestHeader("X-Content-Id", fileId);
          xhr.setRequestHeader("X-Chunk-Length", String(chunk.size));
          xhr.setRequestHeader("X-Content-Length", String(file.size));
          xhr.setRequestHeader("X-Content-Name", file.name);
          xhr.setRequestHeader("X-Chunks-Quantity", String(chunksQuantity));

          // Set token to request header
          xhr.setRequestHeader(
            "Authorization",
            `Bearer `+localStorage.getItem('token')
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
          console.log("All parts uploaded");

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
              console.log("***", "Upload successfully");
            }

            sendNext();
          })
          .catch(() => {
            chunksQueue.push(chunkId!);
          });
      };

      sendNext();

  }
  handleUpdateWithVideo(lecture: File) {
    // if (this.wayModify == ModifyType.new) {
    //   if ((title = '')) {
    //     title = 'Lecture of ' + this.idItem;
    //   }
    //   let tmpSection= this.sections.filter((section)=>{
    //     section.id== this.idItem;
    //   })[0];
    //   let last:number=-1;
    //   let tmpLecture = new Lecture();
    //   for(let i=0; i<this.lectures.length;i++)
    //     if(this.lectures[i].sectionId== tmpSection.id){
    //         tmpLecture= this.lectures[i];
    //         last=i;
    //     }
      
    //   lecture.set('title', title);
    //   lecture.set('sectionId', tmpSection.id);
    //   lecture.set('lectureOrder', String(tmpLecture.lectureOrder+1));
    //   lecture.set('createdAt', String(tmpLecture.createdAt));
    //   lecture.set('updatedAt', String(tmpLecture.updatedAt));
    //   lecture.set('isHidden', String(tmpLecture.idHidden));
    //   //find last lecture of this section and update
    
    //   //Update
    //   this.updateLectureBelow(last+1);
    //   //save video
    //   this.http
    //     .post('http://localhost:8082/upload', lecture)
    //     .subscribe((response) => console.log(response));
    // }
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
    this.onCreateCourse(this.course);
  }
  onSaveSection(section: Section): Observable<Section> {
    //TODO: Http

    console.log('Save section ');
    console.log(section);
    const url = `${this.apiUrlSection}/${section.id}`;

    this.http.put<{ message: String; count: Number; section: Section }>(
      url,
      {
        title: section.title,
        courseId: section.courseId,
        sectionOrder: section.sectionOrder,
        isHidden: section.isHidden,
      },
    httpOptions).subscribe(response=>{
      console.log(response);
    });

    // this.mSectionList.forEach((dataSection)=>{
    //     if(dataSection.id== sectionId){
    //       dataSection.title=section.title;
    //     }
    // })
    return of(section);
  }

  onSaveLecture(lecture: Lecture) {
    //TODO: Http
    console.log('Save lecturer ');
    console.log(lecture);
    const url = `${this.apiUrlLecture}/${lecture.id}`;
    // return this.http.put<Lecture>(url, lecturer, httpOptions);
    this.http
      .put<{ message: String; count: Number; lecture: Lecture }>(
        url,
        {
          id: lecture.id,
          title: lecture.title,
          lectureOrder: lecture.lectureOrder,
          createdAt: lecture.createdAt,
          updatedAt: lecture.updatedAt,
          isHidden: lecture.idHidden,
        },
        httpOptions
      )
      .subscribe((response) => {
        return response.lecture;
      });
  }
  onSaveCourse() {
    //TODO: Http
    console.log('Save Course ');
    console.log(this.course);
    const url = `${this.apiUrlCourse}/${this.course.id}`;
    // this.http.put<{message:String, count:Number, course:Course}>(url, this.course, httpOptions);

    this.http
      .put<{ message: String; count: Number; course: Course }>(
        url,
        {
          title: this.course.title,
          courseDescription: this.course.courseDescription,
          price: this.course.price,
          courseType: this.course.courseType,
          thumbnailUrl: this.course.thumbnailUrl,
          isHidden: this.course.isHidden,
        },
        httpOptions
      )
      .subscribe((response) => {
        console.log(response);
      });
  }
  onDeleteSection() {
    //TODO: Http
    const url = `${this.apiUrlSection}/${this.idItem}`;
    return this.http.delete<{ message: string }>(url,httpOptions).subscribe((response) => {
      console.log(response.message);
      console.log('Delete Section :' + this.idItem);
    });
  }
  onDeleteCourse() {
    //TODO: Http

    const url = `${this.apiUrlCourse}/${this.idItem}`;
    return this.http.delete<{ message: string }>(url,httpOptions).subscribe((response) => {
      console.log(response.message);
      console.log('Delete Course :' + this.idItem);
    });
  }
  onDeleteLecture() {
    //TODO: Http
    const url = `${this.apiUrlLecture}/${this.course.id}`;

    return this.http.delete<{ message: string }>(url,httpOptions).subscribe((response) => {
      console.log(response.message);
      console.log('Delete Section :' + this.idItem);
    });
  }
  onCreateSection(section: Section) {
    // const requestOptions: HttpHeaders = { headers: this.authHeader };
    this.http
      .post<{ message: String; count: Number; section: Section }>(
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
      )
      .subscribe((response) => {
        if (response.count > 0) {
          this.getData();
        }
      });
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
      thumbnailUrl: '../../../assets/images/img1.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
      isHidden: false,
    };
    //Create new Course
    return this.http
      .post<{ message: String; count: Number; course: Course }>(
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
        this.course = response.course;
        this.idCourse = this.course.id;

        let firstSection: Section = new Section();
        firstSection.title = 'Section 1';
        firstSection.courseId = course.id;
        firstSection.sectionOrder = 0;
        this.onCreateSection(firstSection);
      });
  }
  onCreateLecture(lecture: Lecture) {
    console.log('Create lecturer ' + lecture.title);
    console.log(lecture);
    return this.http.post<{ message: String; count: Number; lecture: Lecture }>(
      this.apiUrlLecture,
      {
        id: lecture.id,
        title: lecture.title,
        lectureOrder: lecture.lectureOrder,
        createdAt: lecture.createdAt,
        updatedAt: lecture.updatedAt,
        isHidden: lecture.idHidden,
      },
      httpOptions
    ).subscribe(response=>{
      console.log(response);
    })
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
      idHidden: false,
      sectionId: 'course1sec1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'co1sec1lec2',
      title: 'Video 2',
      lectureOrder: 1,
      idHidden: false,
      sectionId: 'course1sec1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'co1sec2lec1',
      title: 'Video 1',
      lectureOrder: 2,
      idHidden: false,
      sectionId: 'course1sec2',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'co1sec2lec2',
      title: 'Video 2',
      lectureOrder: 3,
      idHidden: false,
      sectionId: 'course1sec2',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'co1sec2lec3',
      title: 'Video 3',
      lectureOrder: 4,
      idHidden: false,
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
      idHidden: false,
    },
    {
      id: 'lec1',
      fileName: 'Video of lecture 1',
      length: 130,
      lectureId: 'co1sec1lec2',
      createdAt: new Date(),
      updatedAt: new Date(),
      idHidden: false,
    },
    {
      id: 'lec2',
      fileName: 'Video of lecture 2',
      length: 0,
      lectureId: 'co1sec2lec1',
      createdAt: new Date(),
      updatedAt: new Date(),
      idHidden: false,
    },
    {
      id: 'lec3',
      fileName: 'Video of lecture 3',
      length: 0,
      lectureId: 'co1sec2lec2',
      createdAt: new Date(),
      updatedAt: new Date(),
      idHidden: false,
    },
    {
      id: 'lec4',
      fileName: 'Video of lecture 4',
      length: 0,
      lectureId: 'co1sec2lec3',
      createdAt: new Date(),
      updatedAt: new Date(),
      idHidden: false,
    },
  ];
}
