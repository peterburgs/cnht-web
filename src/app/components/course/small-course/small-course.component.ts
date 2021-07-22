import {
  Component,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { Course } from 'src/app/models/course.model';
import { PriceFormat } from 'src/app/util/priceformat';
@Component({
  selector: 'app-small-course',
  templateUrl: './small-course.component.html',
  styleUrls: ['./small-course.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class SmallCourseComponent implements OnInit {
  @Input() course = new Course();
  baseUrl = 'https://us-central1-supple-craft-318515.cloudfunctions.net/app/';
  constructor() {}

  ngOnInit(): void {}

  handlePriceFormat(price: number): any {
    return PriceFormat(price, 0, 3, '.', ',');
  }
}
