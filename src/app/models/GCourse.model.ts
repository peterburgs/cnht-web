import { COURSE_TYPE } from './course-type';
import { GRADES } from './grades';
export interface GCourse{
    id:string,
    title:string,
    courseDescription:string,
    price: number,
    courseType: COURSE_TYPE ,
    grade: GRADES,
    thumbnailUrl: string,
    createdAt: Date,
    updatedAt: Date,
    isHidden: boolean,
}