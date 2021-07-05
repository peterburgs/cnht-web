import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { COURSE_TYPE } from 'src/app/models/course-type';
import { Course } from 'src/app/models/course.model';
import { GRADES } from 'src/app/models/grades';
import { CourseService } from 'src/app/service/course.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

      listCourse: Course[] = [];
      titleSearch: string = "";
      grade: string = GRADES.TWELFTH;
      category: string = COURSE_TYPE.THEORY;
      isUseFilter: boolean = false;
      textSearch: string = "";
      listFilter = ["theory", 
      "examination solving"];
      listGrade = ["Grade 12", "Grade 11", "Grade 10"];

      constructor(private route: ActivatedRoute, private router: Router, private courseService: CourseService) {

      }

      ngOnInit(): void {
        this.getTitleFormRouter();
        this.getListSearch();
        this.getListCourseFilter();
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
          this.courseService.getListCourseByTitle(this.titleSearch).subscribe(list => this.listCourse = list);
          this.isUseFilter = false;
          this.setTextSearch(this.titleSearch);
        }
        else
          if(this.listCourse.length === 0) this.isUseFilter = true;
      
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
      // console.log("router0: " + "grade: " + this.grade + "type: " + this.category + "number:" + this.listCourse.length);
        this.route.queryParams
        .subscribe(
          (queryParams: Params) => {
          
            this.category = queryParams['type'];
            this.grade = queryParams['grade'];
          }
        );

        //console.log("router1: " + "grade: " + this.grade + "type: " + this.category + "number:" + this.listCourse.length);
      }


      refreshComponent(){
        this.router.navigate([this.router.url])
    }

    receiveGrade($event: any){
      this.grade = $event;
    }

    receiveCategory($event: any){
    
      this.category = $event;
      console.log("event: " + "grade: " + this.grade + "type: " + this.category + "number:" + this.listCourse.length);
      this.reloadRouter();   //end choose filter for search
      this.getListCourseFilter(); // get list by filter
    }

    getListCourseFilter(){
      if(this.isUseFilter)
      { 
        this.getFormFilterRouter();
        if(!this.category){ // set default search is title null
          this.category =COURSE_TYPE.THEORY;
          this.grade = GRADES.TWELFTH;
        }
        
        this.courseService.getListCourseFilter(this.category, this.grade).subscribe(list => this.listCourse = list);
        this.setTextSearch( this.category + " of " + this.grade );
      }
      
    }

    reloadRouter(){
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
    
        this.router.navigate(['search'], {queryParams: {type: this.category, grade: this.grade }, fragment: 'filter'});
    }

    isFindList(){
        if(this.listCourse.length === 0)
          return false;
        return true;
    }



}
