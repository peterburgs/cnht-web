import { Component, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Course } from 'src/app/models/course.model';
import { Lecture } from 'src/app/models/lecture.model';
import { Section } from 'src/app/models/section.model';
import { User } from 'src/app/models/user.model';
import { authenticationService } from 'src/app/service/authentication.service';
import { CourseService } from 'src/app/service/course.service';
import { UserService } from 'src/app/service/user.service';
import { PriceFormat } from 'src/app/util/priceformat';

@Component({
  selector: 'app-card-image',
  templateUrl: './card-image.component.html',
  styleUrls: ['./card-image.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class CardImageComponent implements OnInit ,OnChanges{

  @Input() course!:Course;
  isBought!: boolean;
  isLoggedin!: Observable<boolean>;
  learner!: User;
  baseUrl='https://us-central1-supple-craft-318515.cloudfunctions.net/app/';
  isLoading= true;
  //*inform alert
  message:string="";
  actionToAlert:string="";
  showInform:boolean= false;
  action:string="";
  successfullBought= false;

  sections: Section[]=[];
  lecture:Lecture[]=[];
  lectureId: string="";
  sectionId:string="";
  isBuying=false;
  failBought=false;
  isAdmin = false;

  constructor(private router:Router,
    private userService: UserService,
    private courseService: CourseService,
    private authService: authenticationService,
    private activeRouter: ActivatedRoute,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {

    //when click back on brower, we have to get course again by url 
    if(this.course==null || this.course==undefined){
      this.activeRouter.params.subscribe(params=>{
        const id= params['id']
        this.courseService.getCourseById(id).subscribe(responseData=>{
          this.course= responseData.courses[0];
          
        })
      })
    }
    //when reloading page, it will not update checkIsLoggedin despite of having subcribe
    if(localStorage.getItem('isLoggedin')=='true')
    {
     
      this.isLoggedin= of(true);
      this.authService.checkIsLoggedin().subscribe(
        isLoggedin =>{
          this.isLoggedin= of(isLoggedin) 
          
        });
    } 
    else{
      this.isLoggedin=of(false)
      this.isBought=false;
      this.isLoading=false;
    }
 
    //Subcibe loggedin status
    
    this.isLoggedin.subscribe(islogin=>{
      if(islogin){

        let email=localStorage.getItem('uemail')?localStorage.getItem('uemail'):"null";
        if(email!=null)
        {
          //get user balance to check
          this.userService.getAllUser()
          .pipe(
            catchError((error)=>{
                
                return throwError(error)
                
            })
          )
          .subscribe(responseData=>{
            let learner = responseData.users.find((user)=> user.email===email)
            if(learner)
            this.learner= learner;
            else{

              this.authService.logOut();
              this.router.navigate(['/login'])
            }
            this.isBought_();
          })
        }
      }
      else{
        this.isBought=false;
      }
      
    })    
    // check admin
    this.isAdmin = this.authService.isAdmin();

    //check status of isLoggedin, if it's true, update learner
    if(this.course.id!='')
    this.getFirstSection(this.course.id);
   
  }

  ngOnChanges(changes:SimpleChanges){
    if(changes.isBought)
     this.isBought_();
  }

  //Checkout this course is bought by user if user loggedin
  isBought_(){
    if(!this.isLoggedin)
    {
      this.isBought= false;
      
    }
    else
     //check is bought
    {
      if(this.course!=undefined){
      this.userService.checkEnrollment(this.course.id, this.learner.id)
      .pipe(
        catchError((error)=>{
            if(error.error.count==0)
              this.isBought=false
           this.isLoading=false;
           return throwError(error) 
        })
      )
      .subscribe(responseData=>{

       this.isBought= true;
       this.isLoading=false;
    })  
      }
      
   }
  }



  /**
   * Format price like 100.000đ
   * @param price 
   * @returns 
   */
  handlePriceFormat(price:number):any{
   return PriceFormat(price,0,3,'.',',');
  }

  /**
   * Navigate to learning screen
   * @param courseId 
   * @param sectionId 
   * @param lectureId 
   */
  goToCourse( courseId: string,sectionId:string, lectureId:string){
    
    this.router.navigate(['/learning',courseId,sectionId,lectureId],{fragment:'learning'});
  }

  /**
   * Get fisrt section of a course by id
   * @param courseId 
   */
  getFirstSection(courseId:string ){

    this.courseService.getSectionByCourseId(courseId)
    .subscribe(data=>{
      this.sections= data.sections
      if(this.sections.length>0)
      {
        this.sectionId= this.sections.sort((a,b)=>{return (a.sectionOrder-b.sectionOrder )})[0].id;
        console.log("Card first section : ", this.sectionId)
        this.getFirstLecture(this.sectionId);

        console.log(this.lectureId)
      }
    })

    
  }

  /**
   * Get first lecture of an section like default lecture when navigate from detail page
   * @param sectionId 
   */
  getFirstLecture(sectionId: string){

   this.courseService.getLecturesBySectionId(sectionId)
    .subscribe(responseData=>{
      this.lecture=responseData.lectures;
      if(this.lecture.length>0)
      this.lectureId= this.lecture.sort((a)=>a.lectureOrder)[0].id;
     else
        this.lectureId="";
    })
    
  }

  /**
   * Check here if user enough money, allow them to buy it, ortherwise, go to wallet page
  */
  goToWallet(){
    if(localStorage.getItem('isLoggedin')=='true')
      {
        
        let email=localStorage.getItem('uemail')?localStorage.getItem('uemail'):"null";
        if(email!=null)
        {
          console.log(email)
          //get user balance to check
          
            if(this.learner.balance <this.course.price)
            {
              // console.log(this.userService.getUserByEmail(email).email)
              //TODO: show alert to announce

              this.actionToAlert="Your balance";
              this.message="The amount in your balance is not enough to buy this course? Go to the wallet page to top up your account."
              this.showInform=true;
              this.action="wallet"
            }
            else{
              //TODO: show alert to announce
              this.showInform= true;
              this.actionToAlert= "Buy now!"
              this.message="Are you sure to buy this course?"
              this.action="buy"
            }
           
       }

      }
    else
      this.router.navigate(['/login']);
  }

  //Close alert
  closeHandler(){
    this.showInform= false;
    this.successfullBought= false;
    this.failBought=false;

  }

  /**
   * Check action click, if user click "Your balance", navigate to 
    wallet page else implement to buy the course
   * @param action_return 
   */
  implementAction(action_return:string){

    if(action_return=='wallet')
    {
      this.router.navigate(["/wallet"]);
    }
    //Buy course
    else{
        if(action_return=='buy')
        console.log(action_return)
        let email=localStorage.getItem('uemail')?localStorage.getItem('uemail'):"null";
        if(email!=null)
        {
          
          if(this.learner.id!= undefined)
          {
            //update  at here
            this.isBuying=true;
            this.userService.buyCourse( this.learner.id ,this.course.id)
            .pipe(
              catchError((error)=>{
                  console.log(error)
                  this.failBought=true;
                  this.isBuying= false;
                 return throwError(error)
                  
              })
            )
            .subscribe(responseData=>{

              //update user balance
              const user:User=this.learner;
              user.balance=user.balance-this.course.price;
              this.userService.updateUser(user)
              .pipe(
                catchError((error)=>{
                    console.log(error)
                    this.failBought=true;

                    this.isBuying= false;
                   return throwError(error)
                    
                })
              )
              .subscribe(data=>{
                this.learner= data.user;
                console.log("Bought successfully!")
                console.log(responseData);
                this.isBuying=false;
                this.isBought=true;
                this.successfullBought=true;
              })
              
            })
            //TODO: Inform that payment success
            console.log(this.showInform)
          }   
        }   
      }
    }

    openSnackBar(message: string, action: string) { // notice success
      this._snackBar.open(message, action, {
        duration: 2000
      });
    }
  }

function Of(arg0: boolean): Observable<boolean> {
  throw new Error('Function not implemented.');
}

