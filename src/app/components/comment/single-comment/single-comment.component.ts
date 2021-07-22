import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import * as moment from 'moment';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Comment } from 'src/app/models/comment.model';
import { User } from 'src/app/models/user.model';
import { authenticationService } from 'src/app/service/authentication.service';
import { CommentService } from 'src/app/service/comment.service';
import { UserService } from 'src/app/service/user.service';
import { CommentChild } from '../CommentChild';

@Component({
  selector: 'app-single-comment',
  templateUrl: './single-comment.component.html',
  styleUrls: ['./single-comment.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class SingleCommentComponent implements OnInit {
  learner!: User;
  avatarUrl!: string | null;
  isLoggedin: boolean = false;
  isCommenting = false;
  successfulComment = true;
  @Input() lectureId!: string;
  @Input() commentChilds: CommentChild[] = [];
  @Input() commentParent!: Comment;
  commentInput: string = '';
  c = new CommentChild();
  commentChildList!: Comment[];

  constructor(
    private userService: UserService,
    private authService: authenticationService,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('isLoggedin') == 'true') {
      this.isLoggedin = true;
      let email = localStorage.getItem('uemail');
      if (email != null)
        this.userService.getAllUser().subscribe((responseData) => {
          let learner_ = responseData.users.find(
            (user) => user.email === email
          );
          if (learner_) this.learner = learner_;
        });

      if (localStorage.getItem('uphotoUrl')) {
        this.avatarUrl = localStorage.getItem('uphotoUrl');
      }
    }

    this.filterChild().subscribe((commentChild) => {
      this.commentChildList = commentChild.subComment.filter(
        (comment) => comment.isHidden === false
      );
    });
    this.getCommentCreator();
  }

  postComment() {
    const commentText = this.commentInput;
    this.commentInput = '';

    const comment: Comment = {
      id: '',
      commentText: commentText,
      parentId: this.commentParent.id,
      userId: this.learner.id,
      lectureId: this.lectureId,
      createdAt: new Date(),
      updatedAt: new Date(),
      isHidden: false,
      learner: this.learner,
    };

    this.isCommenting = true;
    this.commentService
      .saveComment(comment)
      .pipe(
        catchError((error) => {
          if (error.error.count == 0) this.successfulComment = false;
          this.isCommenting = false;
          return throwError(error);
        })
      )
      .subscribe((responseData) => {
        this.isCommenting = false;
        this.commentChildList.push(comment);
      });
  }

  filterChild(): Observable<CommentChild> {
    const commentChild = this.commentChilds.find(
      (comment) =>
        comment.parentId === this.commentParent.id &&
        this.commentParent.isHidden === false
    )!;
    return of(commentChild);
  }

  getCommentCreator() {
    this.userService.getAllUser().subscribe((responseData) => {
      let learner = responseData.users;
      this.commentChildList.forEach((comment) => {
        comment.learner = learner.find((user) => user.id === comment.userId);
      });

      this.commentParent.learner = learner.find(
        (user) => user.id === this.commentParent.userId
      );
    });
  }

  getMomentTime(date: Date): string {
    return moment(date).startOf('minutes').fromNow().toString();
  }
}
