import { Component, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
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
export class CardImageComponent implements OnInit {

  @Input() course = new Course();
  isBought: boolean= false;
  isLoggedin!: Observable<boolean>;
  learner!: User;

  //*inform alert
  message:string="";
  actionToAlert:string="";
  showInform:boolean= false;
  action:string="";

  section: Section[]=[];
  lecture:Lecture[]=[];
  lectureId: string="";
  sectionId:string="";

  constructor(private router:Router,
    private userService: UserService,
    private courseService: CourseService,
    private authService: authenticationService) { }

  ngOnInit(): void {

    console.log(this.course);
    
    //when reloading page, it will not update checkIsLoggedin despite of having subcribe
    if(localStorage.getItem('isLoggedin')=='true')
    {
      this.isLoggedin= of(true);
    } 
 
    //Subcibe loggedin status
    this.authService.checkIsLoggedin().subscribe(
      isLoggedin =>{
        this.isLoggedin= of(isLoggedin) 
        
      });

      if(this.isLoggedin){
        let email=localStorage.getItem('uemail')?localStorage.getItem('uemail'):"null";
        if(email!=null)
        {
          console.log(email)
          //get user balance to check
          this.userService.getUserByEmail(email).subscribe(user=>{
            this.learner= user;
          })
        }
      }

    //check status of isLoggedin, if it's true, update learner


    this.isBought_();
    this.getFirstSection(this.course.id);
    console.log(this.sectionId)
    this.getFirstLecture(this.sectionId);
    console.log(this.lectureId)
  }


  //Checkout this course is bought by user if user loggedin
  isBought_(){

    console.log(this.course.id)
    if(!this.isLoggedin)
    {
      this.isBought= false;
    }
    else
     //check is bought
    if(this.userService.checkCourseBought(this.course.id, this.learner.id))
      this.isBought=true;
    else  this.isBought= false;
  }


  /**
   * Format price like 100.000đ
   * @param price 
   * @returns 
   */
  handlePriceFormat(price:number):any{
    return PriceFormat(price);
  }

  /**
   * Navigate to learning screen
   * @param courseId 
   * @param sectionId 
   * @param lectureId 
   */
  goToCourse( courseId: string,sectionId:string, lectureId:string){
    this.router.navigate(['/learning',courseId,sectionId,lectureId]);
  }

  /**
   * Get fisrt section of a course by id
   * @param courseId 
   */
  getFirstSection(courseId:string ){

    this.section=this.courseService.getSectionByCourseId(courseId);
    if(this.section.length>0)
     this.sectionId= this.section.sort((a)=>a.sectionOrder)[0].id;
  }

  /**
   * Get first lecture of an section like default lecture when navigate from detail page
   * @param sectionId 
   */
  getFirstLecture(sectionId: string){

    this.lecture= this.courseService.getLecturesBySectionId(sectionId);
    if(this.lecture.length>0)
     this.lectureId= this.lecture.sort((a)=>a.lectureOrder)[0].id;
  }

  /**
   * Check here if user enough money, allow them to buy it, ortherwise, go to wallet page
  */
  goToWallet(){
    if(this.isLoggedin)
      {
        
        let email=localStorage.getItem('uemail')?localStorage.getItem('uemail'):"null";
        if(email!=null)
        {
          console.log(email)
          //get user balance to check
          this.userService.getUserByEmail(email).subscribe(user=>
            {
              if(user.balance <this.course.price)
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
            });
       }

      }
    else
      this.router.navigate(['/login']);
  }

  //Close alert
  closeHandler(){
    this.showInform= false;
  }

  /**
   * Check action click, if user click "Your balance", navigate to 
    wallet page else implement to buy the course
   * @param gotowallet 
   */
  implementAction(gotowallet:boolean){

    if(gotowallet)
    {
      this.router.navigate(["/wallet"]);
    }
    //Buy course
    else{
      console.log(gotowallet)
      let email=localStorage.getItem('uemail')?localStorage.getItem('uemail'):"null";
      if(email!=null)
      {
        this.userService.getUserByEmail(email).subscribe(user =>{
          if(user.id!= undefined)
          {
            //update at here
            this.userService.buyCourse( user.id ,this.course.id);
            
            //TODO: Inform that payment success
            this.isBought=true;
            alert("Now you can learn this course");
            // this.action="success_payment";
            // this.actionToAlert=""
            // this.message="Now you can learn this course."
            // this.showInform= true;
            console.log(this.showInform)
          } 
          
        })
        
      }
      
    }
  }

}

function Of(arg0: boolean): Observable<boolean> {
  throw new Error('Function not implemented.');
}

