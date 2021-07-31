import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Course } from 'src/app/models/course.model';
import { FullCourseService } from 'src/app/service/full-course.service';
import { PriceFormat } from 'src/app/util/priceformat';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-lecturer-card-course',
  templateUrl: './lecturer-card-course.component.html',
  styleUrls: ['./lecturer-card-course.component.css'],
})
export class LecturerCardCourseComponent implements OnInit {
  @Input() course = new Course();
  @Input() isLearner: boolean = false;
  baseUrl = environment.baseUrl;
  isPublished = false;
  isHome = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fullCourseService: FullCourseService
  ) {}

  ngOnInit(): void {
    this.checkHome();
  }
  onEditCourse(idItem: string) {
    this.router.navigate(['../', 'course', idItem], { relativeTo: this.route });
  }

  detailCourse(idItem: string) {
    if (!this.isHome)
      this.router.navigate(['../../', 'detail', idItem], {
        relativeTo: this.route,
      });
    else
      this.router.navigate(['../', 'detail', idItem], {
        relativeTo: this.route,
      });
  }

  checkHome() {
    this.router.url.includes('/admin')
      ? (this.isHome = false)
      : this.router.url.includes('/mylearning')
      ? (this.isHome = false)
      : (this.isHome = true);
  }

  handlePriceFormat(price: number): any {
    return PriceFormat(price, 0, 3, '.', ',');
  }
}
