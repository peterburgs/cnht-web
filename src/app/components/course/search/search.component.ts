import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { COURSE_TYPE } from 'src/app/models/course-type';
import { Course } from 'src/app/models/course.model';
import { GRADES } from 'src/app/models/grades';
import { CourseService } from 'src/app/service/course.service';
import { FullCourseService } from 'src/app/service/full-course.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

      listCourse: Course[] = [];
      titleSearch: string = "";
      grade: GRADES = GRADES.TWELFTH;
      category: COURSE_TYPE = COURSE_TYPE.THEORY;
      isUseFilter: boolean = false;
      textSearch: string = "";
      listFilter = [COURSE_TYPE.THEORY, 
      COURSE_TYPE.EXAMINATION_SOLVING];
      listGrade = ["Grade 12", "Grade 11", "Grade 10"];
      listAllCourse: Course[] = [];
      isLoading: boolean = true;

      constructor(private route: ActivatedRoute, private router: Router, private courseService: CourseService,
        private fullCourseService: FullCourseService) {

      }

      ngOnInit(): void {
        this.isLoading = true;
        this.changeRouter();
        this.getAllCourse();
        this.getTitleFormRouter();
        this.getListSearch();
        this.getFormFilterRouter();
        this.getListCourseFilter();
      }

      changeRouter(){
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        }

      getAllCourse(){
          this.courseService.getAllCourse().subscribe(list => 
            
          {
            this.listAllCourse = list.courses;
            this.isLoading = false;
            this.listCourse = this.listAllCourse.filter(course => course.title.toLowerCase().includes(this.titleSearch.toLowerCase()));
          });

         
      }

      setTextSearch(title: string){ // for view client title search
        this.textSearch = title;
      }

      getNameTypeCourseByEnum(categoryIndex: number){
        return this.listFilter[categoryIndex];
      }

      getNameGradeByEnum(gradeIndex: number){
        return this.listGrade[gradeIndex];
      }

      getListSearch(){
        if(this.titleSearch)
        {
          // this.courseService.getListCourseByTitle(this.titleSearch).subscribe(list => 
            
          //   {
          //     if(list.count != 0)
          //         this.listCourse = list.courses
          //     else this.listCourse = []
          //   });
          // console.log("lengt:" + this.listAllCourse.length);
          //this.getAllCourse();
          this.listCourse = this.listAllCourse.filter(course => course.title.toLowerCase().includes(this.titleSearch.toLowerCase()));
          this.isUseFilter = false;
          this.setTextSearch(this.titleSearch);
          console.log("lengt:" + this.listCourse.length);
          console.log("t: " + this.titleSearch);
        }
        else
          if(this.listCourse.length === 0) 
          {
            this.isUseFilter = true;}
      
      }

      getTitleFormRouter(){ //use the title for search
       
        this.route.queryParams
        .subscribe(
          (queryParams: Params) => {
            this.titleSearch = queryParams['title'];
          
          }
        );
      }

      getFormFilterRouter(){ // if change router we use filter for search
      this.route.queryParams
        .subscribe(
          (queryParams: Params) => {
          
            this.category = queryParams['type'];
            this.grade = queryParams['grade'];
          }
        );
      }


      refreshComponent(){
        this.router.navigate([this.router.url])
    }

    receiveGrade($event: any){
      this.grade = $event;
    }

    receiveCategory($event: any){
      this.listCourse=[]
      this.category = $event;
      this.router.routeReuseStrategy.shouldReuseRoute = () => true;
      console.log("event: " + "grade: " + this.grade + "type: " + this.category + "number:" + this.listCourse.length);
      this.reloadRouter();   //end choose filter for search
      this.isUseFilter = true;
      this.getListCourseFilter(); // get list by filter
    }

    getListCourseFilter(){
      if(this.isUseFilter)
      { 
        //this.getFormFilterRouter();
        if(!this.category){ // set default search is title null
          this.category =COURSE_TYPE.THEORY;
          this.grade = GRADES.TWELFTH;
        }
        
        this.courseService.getListCourseGrade(this.grade, this.category)
        .subscribe(data=>{
          if(data.count!=0){
            this.listCourse= data.courses;
            this.isLoading = false;
          }
          else{
            this.listCourse=[]
          }
        } );
        this.setTextSearch( this.category + " of " + this.grade );
      }
      
    }

    reloadRouter(){
        this.router.navigate(['search'], {queryParams: {type: this.category, grade: this.grade }, fragment: 'filter'});
    }

    isFindList(){
       if(this.isLoading == false)
        if(this.listCourse.length === 0)
          return false;
        return true;
    }



}
