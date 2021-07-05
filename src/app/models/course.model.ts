import { COURSE_TYPE } from './course-type';
import { GRADES } from './grades';
export class Course{

    id:string ="";
    title:string="";
    courseDescription:string ="";
    price: number = 0;
    courseType: COURSE_TYPE = COURSE_TYPE.THEORY;
    grade: GRADES = GRADES.TENTH;
    thumbnailUrl: string = "url";
    createdAt: Date = new Date();
    updatedAt: Date = new Date();
    isHidden: boolean = false;
}