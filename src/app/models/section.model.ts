import { Lession } from "./lession.model";

export class Section{

    id: string = "";
    title: string = "";
    courseId: string = "";
    sectionOrder: number = 0;
    createdAt:Date = new Date();
    updatedAt:Date = new Date();
    isHidden: boolean = false;

}