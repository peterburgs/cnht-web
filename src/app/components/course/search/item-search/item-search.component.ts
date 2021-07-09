import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from 'src/app/models/course.model';
import { CourseService } from 'src/app/service/course.service';
import { FormatPrice, PriceFormat } from 'src/app/util/priceformat';

@Component({
  selector: 'app-item-search',
  templateUrl: './item-search.component.html',
  styleUrls: ['./item-search.component.css']
})
export class ItemSearchComponent implements OnInit {

  @Input() courseItem: Course = new Course();

  constructor(private courseService: CourseService,
    private router: Router) { }

 
  ngOnInit(): void {
  }

  numberStudent: number = 0;
  getTotalNumberOfCourse(courseId: string){
    this.courseService.getstudentJoinedNumber(courseId).subscribe(
      responseData=>{
        this.numberStudent= responseData.count;
      }
    )

    return this.numberStudent;

}

  handlePriceFormat(price:number):any{
    return  FormatPrice(+price,0,3,'.',',');

  }


  changeRouter(){
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
   }

}
