import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-create-group-chat',
  templateUrl: './create-group-chat.component.html',
  styleUrls: ['./create-group-chat.component.scss']
})
export class CreateGroupChatComponent implements OnInit{

  user:any
users:any[]=[]
usersPayload:any[]=[]
chatDiGruppo!:FormGroup
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private chatService:ChatService,public dialogRef: MatDialogRef<CreateGroupChatComponent>,private toastr:ToastrService) { }

  ngOnInit(): void {
    this.user=this.data[0]
    this.data[1].forEach((element:any) => {
      if(element.id!=this.user.id){
        this.users.push(element)
      }
    });
    console.log(this.user,this.users)
    this.chatDiGruppo=new FormGroup({
      partecipants_id:new FormControl(''),
      nome:new FormControl('',Validators.required)
    })
  }

  addUser(partecipantId:number){
    this.users.filter((user:any)=>{
      if(user.id==partecipantId){
        this.usersPayload.push(user)
      }
    })
  this.usersPayload= this.usersPayload.filter((value, index, array) => array.indexOf(value) === index);
  }
removeFromUsersPayload(userId:number){
  let newUsersArray:any[]=[]
  this.usersPayload.filter((u:any)=>{
    if(u.id!=userId){
      newUsersArray.push(u)
    }
  })
  this.usersPayload=newUsersArray
}
createChat(){
if(this.chatDiGruppo.controls['nome'].value&&this.usersPayload.length!=0){
  let usersPayloadIds:any[]=[]
  for(let u of this.usersPayload){
usersPayloadIds.push(u.id)
  }
  this.chatService.saveGroupChat(
    {
      messaggio_id:[],
      starter_id:this.user.id,
      partecipants_id:usersPayloadIds,
      tipo_chat:"DI_GRUPPO",
      nome:this.chatDiGruppo.controls['nome'].value
    }
  ).subscribe((chat:any)=>{
    if(chat){
      this.dialogRef.close(chat)
    }
  })
}else{
this.toastr.error("Controlla bene il form")
}
}
}
