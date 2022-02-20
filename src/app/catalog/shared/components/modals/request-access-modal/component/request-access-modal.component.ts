import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'np-request-access-modal',
  templateUrl: './request-access-modal.component.html',
  styleUrls: ['./request-access-modal.component.scss']
})
export class RequestAccessModalComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string
  ) { }

  ngOnInit(): void {
  }

}
