import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-create-group-chat',
  templateUrl: './create-group-chat.component.html',
  styleUrls: ['./create-group-chat.component.scss']
})
export class CreateGroupChatComponent implements OnInit{

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    console.log(this.data)
  }
}
