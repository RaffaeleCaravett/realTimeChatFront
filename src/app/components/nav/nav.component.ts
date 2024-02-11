import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuard } from 'src/app/core/auth.guard';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent  implements OnInit{
user:any
isAuthenticated:boolean=false
constructor(private authGuard:AuthGuard,private authService:AuthService,private router:Router){
  this.authService.subj.subscribe((bool:boolean)=>{
    this.isAuthenticated=this.authGuard.isAuthenticated
  })
}

ngOnInit(): void {
this.isAuthenticated=this.authGuard.isAuthenticated
}
logout(){
  localStorage.clear()
this.authService.token=''
this.authService.refreshToken=''
this.authService.authenticateUser(false)
this.router.navigate(['/home'])
}


goToProfile(){
  if(localStorage.getItem('user')){
    this.user=JSON.parse(localStorage.getItem('user')!)
this.router.navigate(['/profilo',this.user.id])

        }
}
}
