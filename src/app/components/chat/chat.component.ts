import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CreateGroupChatComponent } from '../create-group-chat/create-group-chat.component';
import { Router } from '@angular/router';



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
constructor(private chatService:ChatService,private toastr:ToastrService, private cdr:ChangeDetectorRef,private matDialog:MatDialog,private router:Router){}
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
    if(c.starter.id==this.user.id&&userId==c.partecipants[0].id && c.tipoChat=='SINGOLA'||
      c.starter.id==userId&&this.user.id==c.partecipants[0].id &&c.tipoChat=='SINGOLA'){
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
    if(this.chat.messaggio&&this.chat.messaggio.length>0){
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
}else{

}
}
inviaMessaggio(){
  if(this.chatForm.valid){
    let partecipants:any[]=[]
    for(let p of this.chat.partecipants){
      partecipants.push(p.id)
    }
    this.chatService.saveMessaggio({
chat_id:this.chat.id,
sender_id:this.user.id,
receiver_id:this.chat.partecipants[0].id==this.user.id?[this.chat.starter.id]:partecipants,
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
  this.notifications.forEach((notification:any)=>{
    if(notification.receiver.id==this.user.id&&notification.statoNotifica=="NOT_SAW"){
      console.log(notification)
this.chatService.putNotification(notification.id,{
  sender_id:notification.sender.id,
  receiver_id:[notification.receiver.id],
  testo:notification.testo,
  statoNotifica:"SAW",
  chat_id:c.id
}).subscribe((data:any)=>{
  c.notifications.forEach((ntf:any)=>{
    if(ntf.id==data.id){
      ntf.statoNotifica="SAW"
    }
  })
})
}
})
}
openGroupChat(c:any){
  this.chat=c
  this.notifications=c.notifications
  this.notifications.forEach((notification:any)=>{
    console.log(notification)
    if(notification.receiver.id==this.user.id){
      console.log(notification)
this.chatService.putNotification(notification.id,{
  sender_id:notification.sender.id,
  receiver_id:[notification.receiver.id],
  testo:notification.testo,
  statoNotifica:"SAW",
  chat_id:this.chat.id
}).subscribe((data:any)=>{
})
    }
  })
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
goToProfile(user:any){
  this.router.navigate(['/profilo',user.id])
}
}
