import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_SNACK_BAR_DATA} from "@angular/material/snack-bar";

@Component({
  selector: 'app-display-message-handler',
  templateUrl: './display-message-handler.component.html',
  styleUrls: ['./display-message-handler.component.css']
})
export class DisplayMessageHandlerComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
