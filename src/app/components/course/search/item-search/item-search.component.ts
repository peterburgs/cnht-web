import { Component, Input, OnInit } from '@angular/core';
import { Course } from 'src/app/models/course.model';
import { CourseService } from 'src/app/service/course.service';

@Component({
  selector: 'app-item-search',
  templateUrl: './item-search.component.html',
  styleUrls: ['./item-search.component.css']
})
export class ItemSearchComponent implements OnInit {

  @Input() courseItem: Course = new Course();

  constructor(private courseService: CourseService) { }

 
  ngOnInit(): void {
  }

  
  getTotalNumberOfCourse(courseId: string){
   return this.courseService.getTotalLeanerOfCourse(courseId);

}

  handlePriceFormat(price:number):any{

    var price_format="";
    var zero;
    while(price%1000==0)
    {
      price= price/1000;
      
       zero =price_format;
      price_format = ".000"+price_format;
    }
    zero = price_format;
    price_format=price.toString()+ price_format+"đ";

    return price_format;
  }

}
