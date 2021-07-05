import { User } from "./user.model";

export class Comment{
    [x: string]: any;
    id: string = "";
    commentText: string = "";
    parentId: string = "";
    userId: string = "";
    lectureId: string = "";
    createdAt: Date = new Date();
    updatedAt: Date = new Date();
    idHidden: boolean = false;
    learner?:User;
}