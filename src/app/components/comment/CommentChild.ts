import { Comment } from "src/app/models/comment.model";

export class CommentChild {
    parentId:string="";
    subComment: Comment[]=[];
}