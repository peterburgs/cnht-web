import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable, of } from 'rxjs';
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
  encapsulation: ViewEncapsulation.Emulated
})
export class SingleCommentComponent implements OnInit {

  learner!: User;
  avatarUrl!: string | null;
  isLoggedin: boolean=false;
  
  @Input() lectureId!:string;
  @Input() commentChilds: CommentChild[] = []; 
  @Input() commentParent!: Comment;
  commentInput:string="";
  c= new CommentChild;
  commentChildList!: Comment[];

  constructor(private userService:UserService,
    private authService:authenticationService,
    private commentService:CommentService) { }

  ngOnInit(): void {


    //*check if loggedin==true, allow to comment 
    

    if(localStorage.getItem('isLoggedin')=='true')
    {
      this.isLoggedin= true;
      this.learner=this.userService.getUserInLocalStore();
      if(localStorage.getItem('uphotoUrl'))
      {
        this.avatarUrl=localStorage.getItem('uphotoUrl');
      } 
    }

    this.learner=this.userService.getUserInLocalStore();

    this.filterChild().subscribe(commentChild=>{
      this.commentChildList= commentChild.subComment.filter(comment=> comment.idHidden===false)
    })
    this.getCommentCreator();
    console.log(this.commentChildList)

  }

  postComment(){
    const comment: Comment= {
      id:   "av",
      commentText: this.commentInput,
      parentId: this.commentParent.id,
      userId: this.learner.id ,
      lectureId:  this.lectureId,
      createdAt: new Date(),
      updatedAt:  new Date(),
      idHidden: false,
      learner: this.learner
    }

    this.commentService.saveComment(comment);
    this.commentChildList.push(comment);
    this.commentInput=""
  }

  /**
   * Filter child comment with every comment parent
   * @param commentParent 
   * @returns 
   */
  filterChild():Observable<CommentChild>{
    const commentChild=this.commentChilds.find(comment=> comment.parentId=== this.commentParent.id && this.commentParent.idHidden===false )!;
    return of(commentChild)
  }
 
  /**
   * Get user creating a comment
   * @param learnerId 
   */
  getCommentCreator(){
    this.commentChildList.forEach(comment => {
     this.userService.getUserById(comment.userId).subscribe(user=> comment.learner=user);  

   });

   this.userService.getUserById(this.commentParent.userId)
   .subscribe(user=>this.commentParent.learner=user);

}

}
