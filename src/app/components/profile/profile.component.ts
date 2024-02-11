import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfiloService } from 'src/app/services/profilo.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{

  user:any
chats:any[]=[]
msgs:any[]=[]
startedChats:any[]=[]
navigatingUser:any
constructor(private route:ActivatedRoute,private profiloService:ProfiloService){}

  ngOnInit(): void {

    if(localStorage.getItem('user')){
this.navigatingUser=JSON.parse(localStorage.getItem('user')!)
    }
    this.route.params.subscribe(params => {
      this.profiloService.getUserById(params['id']).subscribe((user:any)=>{
        this.user=user
        if(this.user){
          this.profiloService.getChatByPartecipantId(this.user.id).subscribe((chats:any)=>{
            if(chats){
              for(let c of chats){
                this.chats.push(c)
              }
            }
            this.profiloService.getChatByStarterId(this.user.id).subscribe((chatsAsStarter:any)=>{
              if(chatsAsStarter){
                for(let c of chatsAsStarter){
                  this.chats.push(c)
                  this.startedChats.push(c)
                }
                this.chats=this.chats.filter((value, index, array) => array.indexOf(value) === index);
                this.startedChats=this.startedChats.filter((value, index, array) => array.indexOf(value) === index);
              }
            })
          })
          this.profiloService.getMessagesBySenderId(this.user.id).subscribe((messages:any)=>{
            if(messages){
              for(let m of messages){
                this.msgs.push(m)
              }
            }
          })
        }

      })


    });


  }
deleteProfile(userId:number){
  console.log(userId)
}
}
