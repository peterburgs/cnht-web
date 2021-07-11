import { EventEmitter, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  from,
  Observable,
  of,
  Subject,
  Subscription,
} from 'rxjs';

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
  private baseURL =
    'https://us-central1-supple-craft-318515.cloudfunctions.net/app/api/';
  private authHeader = new HttpHeaders();
  private idToken = localStorage.getItem('token');
  private arrLoading: boolean[]=[];
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
 
  }
  getCourses() {
    return this.courses;
  }
  getData() {
    this.lectures = [];
    this.sections = [];
    this.listDeepSection = [];
    let apiGetLectureOfCourse =
      this.apiUrlCourse + '/' + this.idCourse + '/lectures';
    this.http
      .get<{ message: string; count: number; sections: Section[] }>(
        this.apiUrlSection,
        {
          headers: this.headers,
          params: new HttpParams().set('courseId', this.idCourse),
        }
      )
      .toPromise()
      .then((response) => {
        this.sections = response.sections.sort((s1, s2) => {
          if (s1.sectionOrder > s2.sectionOrder) return 1;
          if (s1.sectionOrder < s2.sectionOrder) return -1;
          return 0;
        });
        console.log(this.sections);
        console.log(response.sections);
        //get section
        this.http
          .get<{ message: string; count: number; lectures: Lecture[] }>(
            apiGetLectureOfCourse,
            {
              headers: this.headers,
            }
          )
          .toPromise()
          .then((response) => {
            this.lectures = response.lectures;
    
            this.sections.forEach((section) => {
              console.log(section.id);
              let tmpLectures: Lecture[] = [];
              tmpLectures = this.lectures
                .filter((lecture) => lecture.sectionId == section.id)
                .sort((l1, l2) => {
                  if (l1.lectureOrder > l2.lectureOrder) {
                    return 1;
                  }
                  if (l1.lectureOrder < l2.lectureOrder) return -1;

                  return 0;
                });

              console.log('Lecture array ne');

              this.listDeepSection.push(
                new SectionDummy(section.id, section.title, tmpLectures)
              );
            });
            console.log('Dummy');
            for(let i=0; i< this.sections.length; i++){
              for(let j=0; j< this.lectures.length; j++){
                  this.arrLoading.push(false);
              }
            }

            this.sbjSectionDummy.next(this.listDeepSection);
           
          })
          .catch((error) => {
            console.log("Yen Le")
            this.sections = this.sections.sort((s1, s2) => {
              if (s1.sectionOrder > s2.sectionOrder) return 1;
              if (s1.sectionOrder < s2.sectionOrder) return -1;
              return 0;
            });
            this.sections.forEach((section) => {
              this.listDeepSection.push(
                new SectionDummy(section.id, section.title, [])
              );
            });
            this.sbjSectionDummy.next(this.listDeepSection);
          });
      })
      .catch((error) => { console.log("Yen Le3") 
        this.sbjSectionDummy.next(this.listDeepSection);
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
    //        this.sbjSectionDummy.next(this.listDeepSection);
    // })
  }
  getArrayLoading(){
    return this.arrLoading;
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
  setPositionLoading(flat:boolean,m:number, n:number){
    this.arrLoading[m*n]=flat;
    console.log(this.arrLoading);
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
    tmpLecture.isHidden = false;
   
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
  handleUpdateWithVideo(file: File, duration: number, 
    sectionIndex:number, lectureIndex:number) {
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
        this.setVideoDuration(duration).subscribe(
          (response) => {
            this.setPositionLoading(false, sectionIndex, lectureIndex);
          },
          (error) => {
            console.log(error.message);
          }
        );
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
                this.setPositionLoading(false, sectionIndex, lectureIndex);
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

  }
  onDeleteCourse() {
    //TODO: Httpf
    const url = `${this.apiUrlCourse}/${this.idCourse}`;
    return this.http.delete<{ message: string }>(url, httpOptions);
   
  }
  onDeleteLecture() {
    //TODO: Http
    const url = `${this.apiUrlLecture}/${this.idItem}`;
    console.log('delete');
    console.log(url);
    return this.http.delete<{ message: string }>(url, httpOptions);
  
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
