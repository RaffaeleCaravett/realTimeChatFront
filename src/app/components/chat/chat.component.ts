import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit,OnDestroy{

user:any
users:any
chatId:number=0
messages:any[]=[]
chats:any[]=[]
chat:any
chatForm!:FormGroup
socket:any
interval:any
constructor(private chatService:ChatService,private toastr:ToastrService){}
  ngOnDestroy(): void {
  clearInterval(this.interval)
 }

  ngOnInit(): void {
    if(localStorage.getItem('user')){
this.user=JSON.parse(localStorage.getItem('user')!)
    }
  this.chatService.getUsers().subscribe((data:any)=>{
    this.users=data
  })

  this.chatService.getChatByStarterId(this.user.id).subscribe((chats:any)=>{
    if(chats){
      for(let c of chats){
                  this.chats.push(c)
      }
    }
    this.chatService.getChatByPartecipantId(this.user.id).subscribe((chats:any)=>{
      if(chats){
        for(let c of chats){
          this.chats.push(c)
}
      }
    })
  })


this.chatForm=new FormGroup({
  messaggio:new FormControl('',Validators.required)
})
  }
stompClient:any
avviaChat(userId:number){
  this.chat=null
  if(userId!=this.user.id){
    if(this.chats&&this.chats.length>0){
      for(let c of this.chats){
    if(c.starter.id==this.user.id&&userId==c.partecipants[0].id||
      c.starter.id==userId&&this.user.id==c.partecipants[0].id){
  this.chat=c
  for(let messaggio of this.chat.messaggio){
    if(messaggio.message_state=="SENT"){
      let receivers:any[]=[]
      for(let r of messaggio.receiver){
        receivers.push(r.id)
      }
      this.chatService.putMessaggio(messaggio.id,
        {
          chat_id:messaggio.chat.id,
sender_id:messaggio.sender.id,
receiver_id:receivers,
messaggio:messaggio.message
        }
      ).subscribe((data:any)=>{})
    }
  }
  this.interval= setInterval(()=>{
this.chatService.getMessaggiByChatId(this.chat.id).subscribe((messaggi:any)=>{
  this.chat.messaggio=messaggi
})
  },3000)
      }
  }
    }

if(!this.chat){
  this.chatService.saveChat(
    {
      messaggio_id:[],
      starter_id:this.user.id,
      partecipants_id:[userId],
      tipo_chat:"SINGOLA"
    }
  ).subscribe((chat:any)=>{
    this.chat=chat
    this.chats.push(chat)
    this.toastr.show("Chat avviata con successo")
    for(let messaggio of this.chat.messaggio){
      if(messaggio.message_state=="SENT"){
        let receivers:any[]=[]
        for(let r of messaggio.receiver){
          receivers.push(r.id)
        }
        this.chatService.putMessaggio(messaggio.id,
          {
            chat_id:messaggio.chat.id,
  sender_id:messaggio.sender.id,
  receiver_id:receivers,
  messaggio:messaggio.message
          }
        ).subscribe((data:any)=>{})
      }
    }
    this.interval= setInterval(()=>{
      this.chatService.getMessaggiByChatId(this.chat.id).subscribe((messaggi:any)=>{
        this.chat.messaggio=messaggi
      })
        },3000)
  })
}
}
}
inviaMessaggio(){
  if(this.chatForm.valid){
    this.chatService.saveMessaggio({
chat_id:this.chat.id,
sender_id:this.user.id,
receiver_id:[this.chat.partecipants[0].id],
messaggio:this.chatForm.controls['messaggio'].value
     }
    ).subscribe((messaggio:any)=>{
      this.chat.messaggio.push(messaggio)
      this.chatForm.reset()
    },err=>{
      this.toastr.error(err.error.message||"Qualcosa è andato storto nel salvataggio del messaggio")
    });
  }
}
}
