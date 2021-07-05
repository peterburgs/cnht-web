import { Lecture } from "./lecture.model";

export class SectionDummy{
    // public lecturer:Lecture[]=[];
    constructor(public section_id:string,public section_title:string, public lecturer:Lecture[] ){

    }
    
}