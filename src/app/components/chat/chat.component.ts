import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit{

user:any
users:any
constructor(private chatService:ChatService){}

  ngOnInit(): void {
    if(localStorage.getItem('user')){
this.user=JSON.parse(localStorage.getItem('user')!)
    }
  this.chatService.getUsers().subscribe((data:any)=>{
    this.users=data
  })
  }

}
