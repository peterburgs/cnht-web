import { TOPICS } from "./TOPICS";

export class Topic {
    id: string='';
    title: string='';
    fileUrl: string='';
    topicType: TOPICS= TOPICS.ALGEBRA;
    isHidden: boolean=false;
    createdAt: Date=new Date();
    updatedAt: Date= new Date();
  }