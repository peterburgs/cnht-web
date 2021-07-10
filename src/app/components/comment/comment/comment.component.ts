import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
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

export class CommentComponent implements OnInit, OnChanges {

  @Input() course!:Course;
  @Input()lectureId!:string;
  @Input()sectionId!:string;

  isLoadingComment=true;
  successfulComment=true;
  user!: User;
  avatarUrl!: string | null;
  isLoggedin: boolean=false;
  commentList:Comment[]=[];
  commentInput:string="";
  //start from clicking button post until successfully post
  isCommenting=false;
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
      //*get comments of a lecture by id
      console.log("reload comment")
      this.getCommentByLectureId();
    })

    //this.userService.getUserInLocalStore().subscribe(user=>this.learner= user)
    
  }

  ngOnChanges(changes:SimpleChanges){
    if(changes.lectureId){
      this.ngOnInit()
      console.log('On changes' )
    }

  
  }
  allowComment(){
    if(localStorage.getItem('isLoggedin')=='true')
    {
      this.isLoggedin= true;
      let email=localStorage.getItem('uemail');
      

      if(email!=null)
        this.userService.getUserByEmail(email).subscribe(responseData=> this.user= responseData.users[0])
      if(localStorage.getItem('uphotoUrl'))
      {
        this.avatarUrl=localStorage.getItem('uphotoUrl');
      } 
    }
  }

  //TODO: GET COMMENTS BY LECTURE ID
  getCommentByLectureId(){
    this.commentList=[]
    this.commentChilds=[]
    this.commentParents=[]
    this.isLoadingComment=true;
    this.commentService.getCommentByLectureId(this.lectureId)
    .pipe(
      catchError((error)=>{
          console.log(error)
          this.isLoadingComment= false;
          
         return throwError(error)
          
      })
    )
    .subscribe(responseData=>{
      this.commentList= responseData.comments;
      this.getParentComment();
     this.getChildComment();
     console.log("**** COMMENT LIST **********")
     console.log(this.commentList)
     this.isLoadingComment=false;
    })
    
  }

  /**
   * Get parent comment from comment list 
   */
  getParentComment(){
    this.commentParents=[];
    console.log(this.commentParents)
    this.commentList.forEach(comment => {
      if(comment.parentId=='' && comment.isHidden== false){
         this.commentParents.push(comment)
         console.log("Parent ...")
      }
    });

    this.commentParents.sort((a,b)=>{return new Date(a.createdAt).getTime()-new Date(b.createdAt).getTime()})

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
        commentChild.subComment.sort((a,b)=>{return (new Date(a.createdAt).getTime()- new Date(b.createdAt).getTime())})
        this.commentChilds.push(commentChild);
    })

    console.log(this.commentChilds)
  }

  postComment(){
    if(this.user!=undefined){
      const comment: Comment= {
        id:  "",
        commentText: this.commentInput,
        parentId:"" ,
        userId: this.user.id,
        lectureId:  this.lectureId,
        createdAt: new Date(),
        updatedAt:  new Date(),
        isHidden: false
      }
      this.isCommenting= true;
      console.log(comment)
      this.commentService.saveComment(comment)
      .pipe(
        catchError((error)=>{
            console.log(error)
            if(error.error.count==0)
              this.successfulComment= false;
            this.isCommenting= false;
           return throwError(error)
            
        })
      )
      .subscribe((responseData)=>{
        console.log(responseData)
        this.commentInput='';
        this.isCommenting= false;
        this.getCommentByLectureId();
      })
      
      console.log(this.commentParents)
      console.log(this.commentChilds)
  
     
    }
  }
    
  
}



