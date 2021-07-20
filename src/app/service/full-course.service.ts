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
  private sections: Section[] = [];
  private lectures: Lecture[] = [];
  private courses: Course[] = [];
  private listDeepSection: SectionDummy[] = [];

  // private authHeader = new HttpHeaders();
  private idToken = localStorage.getItem('token');
  private arrLoading: boolean[]=[];
  private loadingThumbnail=false;
  private baseURL =
    'https://us-central1-supple-craft-318515.cloudfunctions.net/app/api/';
  private apiUrlCourse = this.baseURL + 'courses';
  private apiUrlSection = this.baseURL + 'sections';
  private apiUrlLecture = this.baseURL + 'lectures';
  //================================= Initial =========================
  //save edit Modal in screen
  errorMessage = 'Server error. Try again!!!';
  itemIndex = 0;
  idItem: string = 'default';
  isValid = true;
  idCourse: string = 'default';
  status = 100;
  maxLecture = 1;
  wayModify = ModifyType.new;
  typeSelection = VideoType.lecture;
  stateUploadMedia = true;
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
  sbjUploadMediaSuccessful = new Subject<boolean>();
  sbjLoadingThumbnail= new Subject<boolean>();
  headers: HttpHeaders = new HttpHeaders();

  constructor(private http: HttpClient) {
    this.idToken = localStorage.getItem('token');

  }

  //================================= GET =========================
  /**
   * Get info course current selection
   */
  setCourseSelection() {
    console.log(this.idCourse);
    console.log(this.courses);
    this.courses.forEach((mCourse) => {
      console.log(mCourse.id);
      if (mCourse.id == this.idCourse) {
        console.log(mCourse);
        this.course = mCourse;
      }
    });   
  }
  /**
   *
   * @returns Max lenght of lecture in all section
   */
  getMaxLenLecture() {
    if (this.listDeepSection) {
      let maxLen = 0;
      this.listDeepSection.forEach((dummy) => {
        if (dummy.lecture.length > maxLen) {
          maxLen = dummy.lecture.length;
          this.maxLecture = maxLen;
        }
      });
      return maxLen;
    }
    return 1;
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
  getCourseUpdate(){
    // let urlGetCourse=this.apiUrlCourse+"/"+this.course.id;
    // console.log("*** Get Course info")
    // console.log(urlGetCourse);
    return this.http.get<{message:string, count:number, courses:Course[]}>(this.apiUrlCourse,
        {
          headers: this.headers,
          params: new HttpParams().set('id', this.course.id),
        });
  }
  /**
   *
   * @param lectureId
   * @returns Info of video (main function to get length of this video)
   */
  getVideoInfo(lectureId: string) {
    let urlGetVideo = this.baseURL + 'lectures/' + lectureId + '/video';
    console.log(urlGetVideo);
    return this.http.get<{ message: string; count: number; video: Video }>(
      urlGetVideo,
      httpOptions
    );
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
  getSbjUploadMediaState() {
    return this.sbjUploadMediaSuccessful.asObservable();
  }
  getEstimatedCoursePricing() {
    let urlEstimated = this.baseURL + 'courses/' + this.course.id + '/pricing';
    return this.http.get<{ message: String; price: number }>(
      urlEstimated,
      httpOptions
    );
  }
  getErrorMessage() {
    return this.errorMessage;
  }
  getLoadingThumbanil(){
    return this.sbjLoadingThumbnail.asObservable();
  }
  //================================= SET =========================
  /**
   *  Set index of current lecture selection
   * @param index index of lecture in matrix [sections, []section.lectures]
   */
  setItemIndex(index: number) {
    this.itemIndex = index;
  }
  /**
   *
   * @param duration Duration of video of lecture
   * @returns
   */
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
    console.log(this.sbjWayModify);
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
    if (this.sections[0].id == this.idItem) {
      this.status = 201;
      this.sbjStatus.next(this.status);
      return;
    }
    let urlUpSection = this.baseURL + 'sections/' + this.idItem + '/up';
    console.log('*** Up lection ' + urlUpSection);
    this.http.put<{ message: string }>(urlUpSection, {}, httpOptions).subscribe(
      (response) => {
        this.status = 200;
        this.sbjStatus.next(this.status);
        return;
      },
      (error) => {
        this.status = 500;
        this.sbjStatus.next(this.status);
        this.errorMessage = error.errorMessage;
        return;
      }
    );
  }
  onDownSection() {
    if (this.sections[this.sections.length - 1].id == this.idItem) {
      this.status = 201;
      this.sbjStatus.next(this.status);
      return;
    }
    let urlDownSection = this.baseURL + 'sections/' + this.idItem + '/down';
    this.http
      .put<{ message: StringConstructor }>(urlDownSection, {}, httpOptions)
      .subscribe(
        (response) => {
          this.status = 200;
          this.sbjStatus.next(this.status);
        },
        (error) => {
          this.status = 500;
          this.sbjStatus.next(this.status);
          this.errorMessage = error.errorMessage;
        }
      );
  }
  onUpLecture() {
    let urlUpLecture = this.baseURL + 'lectures/' + this.idItem + '/up';
    let lectureUp: Lecture = this.getLectureSelection();
    let sectionId = '0';
    if (
      this.listDeepSection[0].lecture.length > 0 &&
      this.listDeepSection[0].lecture[0].id == lectureUp.id
    ) {
      this.status = 201;
      this.sbjStatus.next(this.status);
      return;
    }
    for (let i = 0; i < this.listDeepSection.length; i++) {
      if (this.listDeepSection[i].section_id == lectureUp.sectionId) {
        if (this.listDeepSection[i].lecture[0].id == lectureUp.id) {
          sectionId = this.listDeepSection[i - 1].section_id;
        } else {
          sectionId = lectureUp.sectionId;
        }
      }
    }

    this.http
      .put<{ message: StringConstructor }>(
        urlUpLecture,
        {
          sectionId: sectionId,
        },
        httpOptions
      )
      .toPromise()
      .then((response) => {
        this.status = 200;
        this.sbjStatus.next(this.status);
        return;
      })
      .catch((error) => {
        this.status = 500;
        this.sbjStatus.next(this.status);
        return;
      });
  }

  onDownLecture() {
    let urlDownLecture = this.baseURL + 'lectures/' + this.idItem + '/down';
    let lectureDown: Lecture = this.getLectureSelection();
    let sectionId = '0';
    for (let i = 0; i < this.listDeepSection.length; i++) {
      if (this.listDeepSection[i].section_id == lectureDown.sectionId) {
        if (
          i == this.listDeepSection.length - 1 &&
          this.itemIndex == this.listDeepSection[i].lecture.length - 1
        ) {
          this.status = 201;
          this.sbjStatus.next(this.status);
          return;
        } else if (
          this.itemIndex ==
          this.listDeepSection[i].lecture.length - 1
        ) {
          sectionId = this.listDeepSection[i + 1].section_id;
        } else {
          sectionId = this.listDeepSection[i].section_id;
        }
      }
    }
    this.http
      .put<{ message: string }>(
        urlDownLecture,
        {
          sectionId: sectionId,
        },
        httpOptions
      )
      .toPromise()
      .then((response) => {
        this.status = 200;
        this.sbjStatus.next(this.status);
        return;
      })
      .catch((error) => {
        this.handleErrorMessage(error);
        this.status = 500;
        this.sbjStatus.next(this.status);
        return;
      });
  }
  handleErrorMessage(error: any) {
    if (error.status == 404) {
      this.errorMessage = '404: Server not found!!! Try again';
    } else if (error.status == 500) {
      this.errorMessage = '500: Something wrong happen!!! Try again';
    } else if (error.status == 401) {
      this.errorMessage = 'Session expired. Please log in again';
    } else {
      this.errorMessage = 'Something wrong happen!!! Try again';
    }
  }

  //================ HTTP ===============

  initCourses() {
    return this.http.get<{ message: string; count: number; courses: Course[] }>(
      this.apiUrlCourse
    );
  }
  getCourses() {
    return this.courses;
  }
  getData() {
    //Clean all
    this.lectures = [];
    this.sections = [];
    this.listDeepSection = [];
    let apiGetLectureOfCourse =
      this.apiUrlCourse + '/' + this.idCourse + '/lectures';
      console.log("*** getSection")
    let apiGetSectionsOfCourse= this.apiUrlCourse+'/'+ this.idCourse+"/sections"
    this.http
      .get<{ message: string; count: number; sections: Section[] }>(
        apiGetSectionsOfCourse
        ,
        {
          headers: this.headers,
          params: new HttpParams().set('courseId', this.idCourse),
        }
      )
      .toPromise()
      .then((response) => {
        //Sort section by order
        this.sections = response.sections.sort((s1, s2) => {
          if (s1.sectionOrder > s2.sectionOrder) return 1;
          if (s1.sectionOrder < s2.sectionOrder) return -1;
          return 0;
        });
        console.log(this.sections);
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
              //Get lecture in each section, and sort by order
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
              //Notify to component that all data was init
              this.listDeepSection.push(
                new SectionDummy(section.id, section.title, tmpLectures)
              );
            });
            this.getMaxLenLecture();
            //Set up array loading for button upload video
            let lenSection = this.sections.length;
            let maxLecture = this.maxLecture;
           
            for (let i = 0; i < lenSection; i++) {
             
              for (let j = 0; j <  maxLecture ; j++) {
                this.arrLoading.push(false);
              }
            }
            //For check is successfull process
              console.log(this.listDeepSection);
            //Notify get all data finish
            this.sbjSectionDummy.next(this.listDeepSection);
          })
          .catch((error) => {
            //Some case, doesn't have any lecture in section, it was be regconized to error
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
      .catch((error) => {
        //Some case, doesn't have any section in section, it was be regconized to error
        this.sbjSectionDummy.next(this.listDeepSection);
      });
  }
  getArrayLoading() {
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
  setPositionLoading(flat: boolean, m: number, n: number) {
    this.arrLoading[m*this.maxLecture +n] = flat;
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
    this.course.thumbnailUrl = course.thumbnailUrl;
  }

  handleCreateLecture(title: string) {
    let tmpLecture = new Lecture();
    tmpLecture.title = title;
    tmpLecture.sectionId = this.getSectionSelection()[0].id;
    console.log("*** Get section ID")
    console.log(tmpLecture.sectionId);
    tmpLecture.isHidden = false;

    this.onCreateLecture(tmpLecture);
  }
  handleEditTitleLecture(title: string) {
    var tmpLecturer = this.getLectureSelection();

    tmpLecturer.title = title;
    return this.onSaveLecture(tmpLecturer);
  }
  handleEditSection(title: string) {
    var tmpSection = this.getSectionSelection()[0];

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
    this.onCreateSection(tmpSection);
  }

  handleUpdateWithThumbnail(file: File) {
    // let url = this.baseURL + '/thumbnail/' + this.course.id;
    // let url = this.baseURL+"courses/" + this.course.id + '/thumbnail/' ;
    // this.http.post(url, file).subscribe((response) => {
    //   console.log('response');
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
            console.log(castedData.data.course);

            console.log('***', 'Upload successfully');
            this.getCourseUpdate().subscribe(response=>{
              console.log("*** response");
              console.log(response);

              this.course= response.courses[0];
              console.log(this.courses);
              this.loadingThumbnail = false;
              this.sbjLoadingThumbnail.next(this.loadingThumbnail);
              //Update in courses 
              this.courses.forEach(course=>{
                if(course.id == response.courses[0].id){
                  course.thumbnailUrl = response.courses[0].thumbnailUrl;
                }
              })
            })
          }

          sendNext();
        })
        .catch(() => {
          chunksQueue.push(chunkId!);
          this.loadingThumbnail = false;
          this.sbjLoadingThumbnail.next(this.loadingThumbnail);
        });
    };

    sendNext();
  }
  handleUpdateWithVideo(
    file: File,
    duration: number,
    sectionIndex: number,
    lectureIndex: number
  ) {
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
      }).catch((error) => {
        console.log('*** Error happen');
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
            this.setPositionLoading(false, sectionIndex, lectureIndex);

            // this.stateUploadMedia =false;
            // this.sbjUploadMediaSuccessful.next(this.stateUploadMedia);
            // console.log("Error 1");
            // console.log(error.message);
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
            // this.setVideoDuration(duration).subscribe(
            //   (response) => {
            //   //  this.setPositionLoading(false, sectionIndex, lectureIndex);
            //   },
            //   (error) => {
            //     // console.log(error.message);
            //    // this.setPositionLoading(false,sectionIndex, lectureIndex);
            //     // this.stateUploadMedia =false;
            //     // this.sbjUploadMediaSuccessful.next(this.stateUploadMedia);
            //     // console.log("Error 2");
            //     // console.log(error.message);
            //   }
            // );
          }

          sendNext();
        })
        .catch(() => {
          chunksQueue.push(chunkId!);
          //this.setPositionLoading(false,sectionIndex, lectureIndex);
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
  onSaveSection(section: Section) {
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
    console.log('*** Save course');
    console.log(this.course);
    const url = `${this.apiUrlCourse}/${this.course.id}`;

    return this.http.put<{ message: String; count: Number; course: Course }>(
      url,
      {
        id: this.course.id,
        title: this.course.title,
        courseDescription: this.course.courseDescription,
        price: this.course.price,
        courseType: this.course.courseType,
        thumbnailUrl: this.course.thumbnailUrl,
        isPublished: this.course.isPublished,
        grade: this.course.grade,
      },
      httpOptions
    );
  }
  onDeleteSection() {
    const url = `${this.apiUrlSection}/${this.idItem}`;
    return this.http.delete<{ message: any }>(url, httpOptions).subscribe(
      (response) => {
        this.status = 200;
        this.sbjStatus.next(this.status);
        return;
      },
      (error) => {
        this.status = 500;
        this.sbjStatus.next(this.status);
        this.errorMessage = error.errorMessage;
        return;
      }
    );
  }
  onDeleteCourse() {
    const url = `${this.apiUrlCourse}/${this.idCourse}`;
    return this.http.delete<{ message: string }>(url, httpOptions);
  }
  onDeleteLecture() {
    const url = `${this.apiUrlLecture}/${this.idItem}`;
    this.http.delete<{ message: string }>(url, httpOptions).subscribe(
      (response) => {
        this.status = 200;
        this.sbjStatus.next(this.status);
        return;
      },
      (error) => {
        this.status = 500;
        this.sbjStatus.next(this.status);
        this.errorMessage = error.errorMessage;
        return;
      }
    );
  }
  onCreateSection(section: Section) {
    console.log('*** Create section');
    console.log(section);
  
    this.http
      .post<{ message: String; count: Number; section: Section }>(
        this.apiUrlSection,
        {
          title: section.title,
          courseId: section.courseId,
          sectionOrder: section.sectionOrder,
          isHidden: section.isHidden,
        },
        httpOptions
      )
      .subscribe(
        (response) => {
         
          this.status = 200;
          this.sbjStatus.next(this.status);
          return;
        },
        (error) => {
          this.status = 500;
          this.sbjStatus.next(this.status);
          this.errorMessage = error.errorMessage;
          return;
        }
      );
  }

  onCreateCourse(course: Course) {
    console.log('*** create course');
    //Course default
    let courseDefault: Course = {
      id: '',
      title: 'Introduction To Math',
      courseDescription: 'Some fundamentals of Introduction To Information Technology',
      price: 0,
      courseType: COURSE_TYPE.THEORY,
      grade: GRADES.TWELFTH,
      thumbnailUrl: '',
      createdAt: new Date(),  
      updatedAt: new Date(),
      isHidden: false,
      isPublished:true
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
          grade: courseDefault.grade,
          isPublished: courseDefault.isPublished
        },
        httpOptions
      )
      .subscribe((response) => {
          if(response.course){
            this.course = response.course;
            this.idCourse = this.course.id;
          
            this.courses.push(response.course);
            this.sbjCreateCourse.next(this.course);
          }
      }, error=>{
        this.sbjCreateCourse.error("Error");
        return;
      });
  }
  onCreateLecture(lecture: Lecture) {
    console.log('*** create lecture');
    console.log(lecture);
    return this.http
      .post<{ message: String; count: Number; lecture: Lecture }>(
        this.apiUrlLecture,
        {
          courseId: this.idCourse,
          title: lecture.title,
          sectionId: lecture.sectionId,
          lectureOrder: lecture.lectureOrder,
        },
        httpOptions
      )
      .subscribe(
        (response) => {
          // this.lectures.push(response.lecture);
          // //Update int List Section Dummy
          // for (let i = 0; i < this.listDeepSection.length; i++) {
          //   if (
          //     this.listDeepSection[i].section_id == response.lecture.sectionId
          //   ) {
          //     this.listDeepSection[i].lecture.push(response.lecture);
          //     if (
          //       this.listDeepSection[i].lecture.length >
          //       this.maxLecture
          //     ) {
          //       this.maxLecture = this.listDeepSection[i].lecture.length ;
          //       this.arrLoading = [];
          //       //Set up array loading for button upload video
          //       let lenSection = this.sections.length;
          //       let maxLecture = this.maxLecture;
          //       for (let i = 0; i < lenSection; i++) {
          //         for (let j = 0; j <  maxLecture ; j++) {
          //           this.arrLoading.push(false);
          //         }
          //       }
          //       console.log(this.arrLoading);
          //     }
          //   }
          // }
          //Update in lectures

          this.status = 200;
          this.sbjStatus.next(this.status);
          return;
        },
        (error) => {
          this.status = 500;
          this.sbjStatus.next(this.status);
          this.errorMessage = error.errorMessage;
          return;
        }
      );
  }
  
}
