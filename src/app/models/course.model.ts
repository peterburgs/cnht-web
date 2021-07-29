import { GRADES } from './grades';
export class Course {
  id: string = '';
  title: string = '';
  courseDescription: string = '';
  price: number = 0;
  grade: GRADES = GRADES.TENTH;
  thumbnailUrl: string = 'url';
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  isHidden: boolean = false;
  purchasedAt?: Date;
  isPublished: boolean = true;
}
