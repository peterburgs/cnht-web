import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Topic } from '../models/topic.model';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token'),
  }),
};
@Injectable({
  providedIn: 'root',
})
export class TopicService {
  constructor(private http: HttpClient) {}
  topic: Topic = new Topic();
  topics: Topic[] = [];
  headers: HttpHeaders = new HttpHeaders();
  private baseURL =
    'https://us-central1-supple-craft-318515.cloudfunctions.net/app/api/';
  onCreateTopic() {
    console.log("*** from service")
    console.log(this.topic);
    return this.http.post<{ message: String; count: Number; topic: Topic }>(
      this.baseURL + 'topics',
      {
        title: this.topic.title,
        topicType: this.topic.topicType,
        fileUrl:this.topic.fileUrl
      },
      httpOptions
    );
  }
  addTopic(topic: Topic) {
    this.topics.push(topic);
  }
  setTopicCreate(topic: Topic) {
    this.topic = topic;
  }
  onUpdate(iTopic:Topic) {
    return this.http.put<{ message: String; count: Number; topic: Topic }>(
      this.baseURL + 'topics',
      {
        title: iTopic.title,
        topicType: iTopic.topicType,
        fileUrl:iTopic.fileUrl
      },
      httpOptions
    );
  }
  updateTopicFile(idTopic:string,pdfFileTopic:File){
    return this.http.post<{ message: String }>(
      this.baseURL + 'topics/'
      +idTopic+'/files/upload',
      {
        id:idTopic,
        fileUrl:pdfFileTopic
      },
      httpOptions
    );
  }
  getTopics() {
    console.log("*** from get Topics")
    return this.http.get<{ message: String; count: Number; topics: Topic[] }>(
      this.baseURL + 'topics',
      httpOptions
    );
  }

  getTopicById(id: string) {

    this.topics.forEach((topic) => {
      if (topic.id == id) {
        this.topic= topic;
      }
    });
    return this.topic;

    // return this.http.get<{ message: String; count: Number; topic: Topic }>(
    //   this.baseURL + 'topics',
    //   {
    //     headers: this.headers,
    //     params: new HttpParams().set('id', id),
    //   }
    // );
  }
  updateTopicInList(topic:Topic){
    this.topics.forEach(itemTopic=>{
      if(topic.id == topic.id){
        itemTopic.title= topic.title;
        itemTopic.topicType=topic.topicType;
        itemTopic.fileUrl= topic.fileUrl
      }
    })
  }
}
