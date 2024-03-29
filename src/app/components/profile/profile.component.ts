import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfiloService } from 'src/app/services/profilo.service';
import { UserOperationsComponent } from '../user-operations/user-operations.component';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

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
constructor(private route:ActivatedRoute,private profiloService:ProfiloService,private dialogRef:MatDialog,private authService:AuthService,
private toastr:ToastrService,private router:Router){}

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
deleteProfile(){
  const dialog = this.dialogRef.open(UserOperationsComponent,{data:'delete'})
  dialog.afterClosed().subscribe((result:string)=>{
if(result=='yes'){
  this.profiloService.deleteUser('me').subscribe((deleted:any)=>{
if(deleted){
  localStorage.clear()
  this.authService.setToken('')
  this.authService.setRefreshToken('')
  this.authService.authenticateUser(false)
  this.router.navigate(['/'])
}
  })
}
  })
}

putProfile(user:any){
  const dialog = this.dialogRef.open(UserOperationsComponent,{data:[user,'modify']})
  dialog.afterClosed().subscribe((result:any)=>{
    if(result){
      this.profiloService.modifyUser('me',result).subscribe((u:any)=>{
    if(u){
      localStorage.setItem('user',JSON.stringify(u))
     this.user=JSON.parse(localStorage.getItem('user')!)
    }
    this.toastr.show('User modificato.')
      },err=>{
        this.toastr.show('Errore. User non modificato.')
      })
    }
      })
}
}
