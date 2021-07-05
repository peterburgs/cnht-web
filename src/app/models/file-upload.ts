export class Upload{
    $key!:string;
    file!:File;
    title!:string;
    url!:string;
    progress!:number;
    createAt:Date=new Date();
    constructor(file:File){
        this.file=file;
    }
}