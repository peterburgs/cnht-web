import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
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
  isUploadTopicFile = false;
  sbjUploadTopicFile = new Subject<boolean>();
  headers: HttpHeaders = new HttpHeaders();
  private baseURL = environment.baseUrl + '/api/';
  onCreateTopic() {
    return this.http.post<{ message: String; count: Number; topic: Topic }>(
      this.baseURL + 'topics',
      {
        title: this.topic.title,
        topicType: this.topic.topicType,
        fileUrl: this.topic.fileUrl,
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
  onUpdate(iTopic: Topic) {
    return this.http.put<{ message: String; count: Number; topic: Topic }>(
      this.baseURL + 'topics/' + iTopic.id,
      {
        title: iTopic.title,
        topicType: iTopic.topicType,
        fileUrl: iTopic.fileUrl,
      },
      httpOptions
    );
  }

  updateTopicFile(topicId: string, pdfFileTopic: File) {
    const fileId = new Date().getTime().toString();
    const chunkSize = 9 * 1024 * 1024;
    const chunksQuantity = Math.ceil(pdfFileTopic.size / chunkSize);
    const chunksQueue = [...Array(chunksQuantity)]
      .map((_, index) => index)
      .reverse();

    const upload = (chunk: Blob, chunkId: number) => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('post', `${this.baseURL}topics/${topicId}/files/upload`);

        xhr.setRequestHeader('Content-Type', 'application/octet-stream');
        xhr.setRequestHeader('X-Chunk-Id', String(chunkId));
        xhr.setRequestHeader('X-Content-Id', fileId);
        xhr.setRequestHeader('X-Chunk-Length', String(chunk.size));
        xhr.setRequestHeader('X-Content-Length', String(pdfFileTopic.size));
        xhr.setRequestHeader('X-Content-Name', pdfFileTopic.name);
        xhr.setRequestHeader('X-Chunks-Quantity', String(chunksQuantity));
        xhr.setRequestHeader(
          'Authorization',
          `Bearer ` + localStorage.getItem('token')
        );

        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            resolve({ status: 200, data: JSON.parse(this.responseText) });
          } else if (xhr.readyState === 4 && xhr.status === 201) {
            resolve({ status: 201, data: JSON.parse(this.responseText) });
          } else if (xhr.readyState === 4 && xhr.status === 404) {
            reject();
          }
        };
        xhr.onerror = reject;

        xhr.send(chunk);
      });
    };

    const sendNext = () => {
      if (!chunksQueue.length) {
        this.isUploadTopicFile = false;
        this.sbjUploadTopicFile.next(this.isUploadTopicFile);
        return;
      }
      const chunkId = chunksQueue.pop();
      const begin = chunkId! * chunkSize;
      const chunk = pdfFileTopic.slice(begin, begin + chunkSize);

      upload(chunk, chunkId!)
        .then((res) => {
          const castedData = res as {
            status: number;
            data: { [index: string]: string };
          };
          if (castedData.status === 201) {
            this.isUploadTopicFile = false;
            this.sbjUploadTopicFile.next(this.isUploadTopicFile);
          }
          sendNext();
        })
        .catch(() => {
          chunksQueue.push(chunkId!);
        });
    };

    sendNext();
  }
  setTopics(listTopics: Topic[]) {
    this.topics = listTopics;
  }
  getIsUpdateFile() {
    return this.sbjUploadTopicFile.asObservable();
  }
  getTopics() {
    return this.http.get<{ message: String; count: Number; topics: Topic[] }>(
      this.baseURL + 'topics',
      httpOptions
    );
  }

  getTopicByIdRemote(id: string) {
    return this.http.get<{ message: String; count: Number; topics: Topic[] }>(
      this.baseURL + 'topics',
      {
        headers: this.headers,
        params: new HttpParams().set('topicId', id),
      }
    );
  }
  getTopicById(id: string) {
    this.topics.forEach((topic) => {
      if (topic.id == id) {
        this.topic = topic;
      }
    });
    return this.topic;
  }
  updateTopicInList(topic: Topic) {
    this.topics.forEach((itemTopic) => {
      if (topic.id == topic.id) {
        itemTopic.title = topic.title;
        itemTopic.topicType = topic.topicType;
        itemTopic.fileUrl = topic.fileUrl;
      }
    });
  }

  downloadFile(urlTopic: string) {
    let baseUrl = environment.baseUrl + urlTopic;
    const httpOptions = {
      responseType: 'blob' as 'json',
    };

    return this.http.get(baseUrl, httpOptions);
  }
  getFileFromUrl(urlTopic: string) {
    return this.http.get(urlTopic, { responseType: 'blob' });
  }
  onDeleteTopic(id: string) {
    return this.http.delete<{ message: string }>(
      this.baseURL + 'topics/' + id,
      httpOptions
    );
  }
}
