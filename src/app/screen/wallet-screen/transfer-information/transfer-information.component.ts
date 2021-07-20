import { Component, OnInit, ElementRef } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DepositRequest } from 'src/app/models/deposit-request.model';
import { STATUSES } from 'src/app/models/statuses';
import { User } from 'src/app/models/user.model';
import { DepositRequestService } from 'src/app/service/deposit-request.service';
import { FullCourseService } from 'src/app/service/full-course.service';
import { UserService } from 'src/app/service/user.service';
import { FormatPrice, PriceFormat } from 'src/app/util/priceformat';

@Component({
  selector: 'app-transfer-information',
  templateUrl: './transfer-information.component.html',
  styleUrls: ['./transfer-information.component.css']
})
export class TransferInformationComponent implements OnInit {

  fileToUpLoad: File = new File([], 'hinh-a');
  thumnailUrl:string= "";
  
  money_Transfer!: string;
  //* Show announcement
  showAnnouncement:boolean= false;
  actionToAlert!:string;
  message!:string;
  action!:string;
  title!:string;
  inputError="";
  learner!:User;
  successResquest=false;
  isLoading=false;

  constructor(private depositService:DepositRequestService,
    private userService: UserService,
    private fullCourseService:FullCourseService) { 
    
  }
  ngOnInit(): void {
    if(localStorage.getItem('isLoggedin')=='true')
    {
      let email=localStorage.getItem('uemail');
      if(email!=null)
        this.userService.getAllUser()
        .subscribe(responseData=>{
          let learner_= responseData.users.find((user)=> user.email===email);
          if(learner_)
              this.learner= learner_;
        } )
    }
  }

 

  handleImageFileInput(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {

      this.fileToUpLoad = <File>fileList.item(0);
      var reader = new FileReader();
      //update Image to UI
      reader.onload = (event: any) => {
       this.thumnailUrl = event.target.result;
      };
      reader.readAsDataURL(this.fileToUpLoad);
    }

  }

  cancelUploadImage(){
    this.thumnailUrl="";
  }

  /**
   * Create deposit request
   */
  createDepositeRequest(){
    if(this.money_Transfer==undefined) 
    {
      this.showAnnouncement=true;
      this.actionToAlert="Yes"
      this.message="You have to fill the money to transfer!"
      this.action="money_invalid"

      return;
    }
    const money = Number(this.money_Transfer.replace('.',''))
    
    if(money<1000)
    {
      this.showAnnouncement=true;
      this.actionToAlert="Yes"
      this.title="Announcement"
      this.message="Your money have to greater than 1,000VND . Let's try again!"
      this.action="money_invalid"

     
    }
    else
    if(this.thumnailUrl=="")
    {
      this.showAnnouncement=true;
      this.title= "Announcement"
      this.actionToAlert="Yes"
      this.message="You have to choose image. Let's try again!"
      this.action="image_invalid"
    }
    else{
      this.showAnnouncement=true;
      this.title= "Confirmation"
      this.actionToAlert="Confirm"
      this.message="You'v transfered "+money+"VND . Let's confirm!"
      this.action="transfer_money"
    }
  }

  closeHandler(){
    this.showAnnouncement= false;
  }

  closeSuccess(){
    this.successResquest=false;
  }

  implementAction(action_return:string){
    if(action_return=="confirm_transfer")
    {
      this.showAnnouncement=false;
      //TODO: Send deposite request to admin
      if(this.learner){
        const amount=Number(this.money_Transfer.replace('.',''));
        const deposit:DepositRequest={
          id:"",
          learnerId: this.learner.id, 
          amount: amount ,
          imageUrl: "abc",
          depositRequestStatus: STATUSES.PENDING,
          createdAt: new Date(),
          updatedAt:new Date()
        }

        this.isLoading=true;
        this.depositService.createDepositRequest(deposit)
        .pipe(
          catchError((error)=>{
              this.isLoading=false;
              this.showAnnouncement=true;
              this.actionToAlert="Ok"
              this.message="Error system. Please try again!"
              this.action="not_success"
              
              this.thumnailUrl=""
              return throwError(error)
          })
        )
        .subscribe(response=>{
          this.depositService.uploadDepositImage(this.fileToUpLoad, response.depositRequest.id)
          this.isLoading=false;
          this.successResquest=true;
          this.money_Transfer=''
          this.thumnailUrl=""
          
        })

        
      }
      
    }

  }

  //Format money
  priceInputFormator(input:string):string{
    var temp;
    while(input.includes('.')){
      input= input.replace('.','')

    }

    if(Number(input).toString()==='NaN') 
    {      return '0';
      
    }
    else{
      return  FormatPrice(+input,0,3,'.',',');
    }
  }
  

}
