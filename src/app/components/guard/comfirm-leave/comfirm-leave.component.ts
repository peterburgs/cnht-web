import { Component, OnInit } from '@angular/core';
import { ModalServiceService } from 'src/app/service/modal-service.service';

@Component({
  selector: 'app-comfirm-leave',
  templateUrl: './comfirm-leave.component.html',
  styleUrls: ['./comfirm-leave.component.css'],
})
export class ComfirmLeaveComponent implements OnInit {
  constructor(public modalService: ModalServiceService) {}

  ngOnInit(): void {}
  choose(choice: boolean) {
    this.modalService.setNavigate(choice);
  }
}
