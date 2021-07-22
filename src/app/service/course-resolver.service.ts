import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterState } from '@angular/router';
import { Resolver } from 'dns';
import { Observable } from 'rxjs';
import { Course } from '../models/course.model';
import { GCourse } from '../models/GCourse.model';
import { FullCourseService } from './full-course.service';

@Injectable({
  providedIn: 'root',
})
export class CourseResolverService {}
