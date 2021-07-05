import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Comment } from 'src/app/models/comment.model';
import { Course } from 'src/app/models/course.model';
import { User } from 'src/app/models/user.model';
import { authenticationService } from 'src/app/service/authentication.service';
import { CommentService } from 'src/app/service/comment.service';
import { UserService } from 'src/app/service/user.service';
import { listComment } from 'src/app/util/mockData';
import { CommentChild } from '../CommentChild';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
  encapsulation : ViewEncapsulation.Emulated
})

export class CommentComponent implements OnInit {

  @Input() course!:Course;
  @Input()lectureId!:string;
  @Input()sectionId!:string;

  learner!: User;
  avatarUrl!: string | null;
  isLoggedin: boolean=false;
  commentList:Comment[]=[];
  commentInput:string="";
  
  commentParents:Comment[]=[];
  commentChilds : CommentChild[]= []

  constructor(
    private userService:UserService,
    private route:ActivatedRoute,
    private commentService: CommentService) { }

  ngOnInit(): void {

    //*check if loggedin==true, allow to comment 
    this.allowComment();
    //get lecture id and section id    
    this.route.params.subscribe(params=>{
      this.lectureId= params['lectureId'];
      this.sectionId=params['sectionId'];
    
    })
    this.learner= this.userService.getUserInLocalStore();

    //*get comments of a lecture by id
    this.getCommentByLectureId();

    //TODO: Sort comment with created date
    this.getParentComment();
    this.getChildComment();
  }

  allowComment(){
    if(localStorage.getItem('isLoggedin')=='true')
    {
      this.isLoggedin= true;
      this.learner=this.userService.getUserInLocalStore();
      if(localStorage.getItem('uphotoUrl'))
      {
        this.avatarUrl=localStorage.getItem('uphotoUrl');
      } 
    }
  }

  getCommentByLectureId(){
    this.commentService.getCommentByLectureId(this.lectureId).subscribe(comments=>{
      this.commentList= comments;

    })
    console.log(this.commentList)
  }

  /**
   * Get parent comment from comment list 
   */
  getParentComment(){
    this.commentParents=[];
    this.commentList.forEach(comment => {
      if(comment.parentId=="" && comment.idHidden==false){
         this.commentParents.push(comment)
      }
    });

    console.log(this.commentParents)
   
  }

  /**
   * Filter child comment and push into childCommentList
   */
  getChildComment(){
    this.commentChilds=[]
    this.commentParents.forEach(comment=>{
        const commentChild : CommentChild= new CommentChild;
        commentChild.parentId= comment.id;
        commentChild.subComment= this.commentList.filter(comment_=> comment_.parentId=== comment.id);
        
        this.commentChilds.push(commentChild);
    })
    console.log(this.commentChilds)
  }

  postComment(){
    const comment: Comment= {
      id:  Date.now.toString(),
      commentText: this.commentInput,
      parentId:"" ,
      userId: this.learner.id ,
      lectureId:  this.lectureId,
      createdAt: new Date(),
      updatedAt:  new Date(),
      idHidden: false
    }

    this.commentService.saveComment(comment);
    console.log("list comment:")
    this.getCommentByLectureId();

    this.getParentComment();
    console.log(this.commentParents)

    this.getChildComment();
    console.log(this.commentChilds)

    this.commentInput='';
  }

  

  

  
}



