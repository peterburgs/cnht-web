import { Component, OnInit } from '@angular/core';
import { PriceFormat } from 'src/app/util/priceformat';

@Component({
  selector: 'app-transfer-information',
  templateUrl: './transfer-information.component.html',
  styleUrls: ['./transfer-information.component.css']
})
export class TransferInformationComponent implements OnInit {

  fileToUpLoad: File = new File([], 'hinh-a');
  thumnailUrl:string= "../../../../assets/images/wellet.png";
  constructor() { }
  moneyTransfer!: string;
  //* Show announcement
  showAnnouncement:boolean= false;
  actionToAlert!:string;
  message!:string;
  action!:string;

  ngOnInit(): void {
    
  }

  handlePriceFormat(){
    this.moneyTransfer= PriceFormat(Number(this.moneyTransfer))
    
  }

  handleFileInput(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      console.log('FileUpload -> files', fileList);

      this.fileToUpLoad = <File>fileList.item(0);
      var reader = new FileReader();
      //update Image to UI
      reader.onload = (event: any) => {
       this.thumnailUrl = event.target.result;
      };
      console.log(this.thumnailUrl)
      reader.readAsDataURL(this.fileToUpLoad);
    }
  }

  cancelUploadImage(){
    this.thumnailUrl="../../../../assets/images/wellet.png";
  }

  /**
   * Create deposit request
   */
  createDepositeRequest(){
    const money = Number(this.moneyTransfer)
    
    if(money>1000)
    {
      this.showAnnouncement=true;
      this.actionToAlert="Confirm"
      this.message="You'v transfered "+money+"VND . Let's confirm!"
      this.action="transfer_money"
    }
    else
    if(this.thumnailUrl=="../../../../assets/images/wellet.png")
    {
      this.showAnnouncement=true;
      this.actionToAlert="Yes"
      this.message="You have to choose image. Let's try again!"
      this.action="image_invalid"
    }
    else{
      this.showAnnouncement=true;
      this.actionToAlert="Yes"
      this.message="Your money have to greater than 1,000VND . Let's try again!"
      this.action="money_invalid"
    }
  }

  closeHandler(){
    this.showAnnouncement= false;
  }

  implementAction(action_return:string){
    if(action_return=="confirm_transfer")
    {
      //TODO: Send deposite request to admin
      
    }

  }


}
