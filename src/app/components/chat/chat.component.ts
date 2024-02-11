import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CreateGroupChatComponent } from '../create-group-chat/create-group-chat.component';



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
notifications:any[]=[]
interval1:any
constructor(private chatService:ChatService,private toastr:ToastrService, private cdr:ChangeDetectorRef,private matDialog:MatDialog){}
  ngOnDestroy(): void {
  clearInterval(this.interval)
  clearInterval(this.interval1)
 }
  ngOnInit(): void {
    if(localStorage.getItem('user')){
this.user=JSON.parse(localStorage.getItem('user')!)
    }
  this.chatService.getUsers().subscribe((data:any)=>{
    this.users=data
  })
 this.getChats()
  this.interval1= setInterval(()=>{
  this.getChats()
},10000)



this.chatForm=new FormGroup({
  messaggio:new FormControl('',Validators.required)
})
  }


getChats(){
  let cts:any[]=[]
  this.chatService.getChatByStarterId(this.user.id).subscribe((chats:any)=>{
    if(chats){
      for(let c of chats){
                  cts.push(c)
     this.getNotifications(c.id)
      }
    }
    this.chatService.getChatByPartecipantId(this.user.id).subscribe((chats:any)=>{
      if(chats){
        for(let c of chats){
          cts.push(c)
          this.getNotifications(c.id)
}
      }
      this.chats=cts
    })
  })
}

avviaChat(userId:number){
  this.chat=null
  if(userId!=this.user.id){
    if(this.chats&&this.chats.length>0){
      for(let c of this.chats){
    if(c.starter.id==this.user.id&&userId==c.partecipants[0].id||
      c.starter.id==userId&&this.user.id==c.partecipants[0].id){
  this.chat=c
  this.updateNotifications(c)
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
messaggio:messaggio.message,
stato:"SAW"
        }
      ).subscribe((data:any)=>{})
    }
  }
  this.ngOnDestroy()
  this.interval= setInterval(()=>{
this.chatService.getMessaggiByChatId(this.chat.id).subscribe((messaggi:any)=>{
  this.chat.messaggio=messaggi
})
this.getNotifications(this.chat.id)
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
    this.updateNotifications(chat)
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
  messaggio:messaggio.message,
  stato:"SAW"
          }
        ).subscribe((data:any)=>{})
      }
    }
    this.ngOnDestroy()
    this.interval= setInterval(()=>{
      this.chatService.getMessaggiByChatId(this.chat.id).subscribe((messaggi:any)=>{
        this.chat.messaggio=messaggi
      })
     this.getNotifications(this.chat.id)
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
receiver_id:[this.chat.partecipants[0].id==this.user.id?this.chat.starter.id:this.chat.partecipants[0].id],
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
getNotifications(chatId:number,notf?:any){
  this.chatService.getNotificationsByChatIdAndNotificationState(chatId,"NOT_SAW").subscribe((notification:any)=>{
    this.notifications=notification
    if(notf){
      notf=notification
      this.cdr.detectChanges()
    }
  })
}
updateNotifications(c:any){
  if(c.notifications&&c.notifications[0]&&c.notifications[0].receiver[0].id==this.user.id&&c.notifications[0].statoNotifica=="NOT_SAW"){
    let receivers:any[]=[]
    for(let r of c.notifications[0].receiver){
      receivers.push(r.id)
    }
    this.chatService.putNotification(c.notifications[0].id,{
      sender_id:c.notifications[0].sender.id,
      receiver_id:receivers,
      testo:c.notifications[0].testo,
      statoNotifica:"SAW",
      chat_id:this.chat.id
    }).subscribe((data:any)=>{
      if(data){
        c.notifications[0].statoNotifica="SAW"

      }
    })
  }
    else if(c.notifications&&c.notifications[1]&&c.notifications[1].receiver[0].id==this.user.id&&c.notifications[1].statoNotifica=="NOT_SAW"){
      let receivers:any[]=[]
      for(let r of c.notifications[1].receiver){
        receivers.push(r.id)
      }
this.chatService.putNotification(c.notifications[1].id,{
  sender_id:c.notifications[0].sender.id,
  receiver_id:receivers,
  testo:c.notifications[0].testo,
  statoNotifica:"SAW",
  chat_id:this.chat.id
}).subscribe((data:any)=>{
  if(data){
    c.notifications[1].statoNotifica="SAW"
  }
})
    }
}
openGroupChat(c:any){
  this.chat=c
}
createGroupChat(){
  let users:any[]=[]
  this.chatService.getAllUsersList().subscribe((us:any)=>{
if(us){
users=us
const dialogRef= this.matDialog.open(CreateGroupChatComponent,{data:[this.user,users]})
dialogRef.afterClosed().subscribe((data:any)=>{if(data){
  this.chats.push(data)
}})
}
  })

}
}
