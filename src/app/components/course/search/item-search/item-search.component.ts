import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from 'src/app/models/course.model';
import { CourseService } from 'src/app/service/course.service';
import { PriceFormat } from 'src/app/util/priceformat';

@Component({
  selector: 'app-item-search',
  templateUrl: './item-search.component.html',
  styleUrls: ['./item-search.component.css'],
})
export class ItemSearchComponent implements OnInit {
  @Input() courseItem: Course = new Course();
  baseUrl: string =
    'https://us-central1-supple-craft-318515.cloudfunctions.net/app/';

  constructor(private courseService: CourseService, private router: Router) {}

  ngOnInit(): void {
    this.getTotalNumberOfCourse(this.courseItem.id);
  }

  numberStudent: number = 0;
  getTotalNumberOfCourse(courseId: string) {
    this.courseService
      .getstudentJoinedNumber(this.courseItem.id)
      .subscribe((responseData) => {
        this.numberStudent = responseData.count;
      });
  }

  handlePriceFormat(price: number): any {
    return PriceFormat(price, 0, 3, '.', ',');
  }

  changeRouter() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
  }
}
