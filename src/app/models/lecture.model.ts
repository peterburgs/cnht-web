
export class Lecture{
    id: string = "";
    title: string = "";
    sectionId: string = "";
    lectureOrder: number = 0;
    createdAt: Date = new Date();
    updatedAt: Date = new Date();
    isHidden: boolean = false;
    length:number=0;
}