import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

loginForm!:FormGroup
signupForm!:FormGroup
section:string=''
error:string=''
constructor(private authService:AuthService,private router:Router,private toastr:ToastrService){}

ngOnInit(): void {
  this.section='login'
  this.loginForm=new FormGroup({
    email:new FormControl('',[Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    password:new FormControl('',Validators.required)
    })
    this.signupForm=new FormGroup({
      nome: new FormControl('',[Validators.required,Validators.minLength(2)]),
      cognome: new FormControl('',[Validators.required,Validators.minLength(2)]),
      email:new FormControl('',[Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      eta:new FormControl('',[Validators.required,Validators.min(18)]),
    password:new FormControl('',[Validators.required,Validators.minLength(6)]),
    ripetiPassword:new FormControl('',[Validators.required,Validators.minLength(6)])
    })
}
login(){
  if(this.loginForm.valid){
    this.authService.logIn(
      {email:this.loginForm.controls['email'].value,password:this.loginForm.controls['password'].value}
    ).subscribe(
      (tokens:any)=>{
        if(tokens){
          this.authService.token=tokens.tokens.accessToken
          this.authService.refreshToken=tokens.tokens.refreshToken
          localStorage.setItem('accessToken',this.authService.token)
          localStorage.setItem('refreshToken',this.authService.refreshToken)
          this.authService.authenticateUser(true)
          this.authService.verifyToken(this.authService.token).subscribe((user:any)=>{
            localStorage.setItem('user',JSON.stringify(user))
            this.router.navigate(['/chat'])
          this.toastr.success("Accesso effettuato come " + user.nome + " " + user.cognome)
          },err=>{
          this.authService.verifyRefreshToken(this.authService.refreshToken).subscribe((tkns:any)=>{
            if(tkns){
              this.authService.setToken(tkns.accessToken)
              this.authService.setRefreshToken(tkns.refreshToken)
              localStorage.setItem('accessToke',this.authService.token)
              localStorage.setItem('refreshToken',this.authService.refreshToken)
              this.authService.authenticateUser(true)
              this.authService.verifyToken(this.authService.token).subscribe((user:any)=>{
                if(user){
                  localStorage.setItem('user',JSON.stringify(user))
                  this.router.navigate(['/chat'])
                }
              })
            }
          })
          })

          }  this.toastr.success("Accesso effettuato con successo.")
          },err=>{
            this.toastr.error(err.error.message||"Accesso respinto.")
          })
          }
          else{
            this.toastr.error("Completa il form.")

          }
  }
  signup(){
    if(this.signupForm.valid&&this.signupForm.controls['password'].value==this.signupForm.controls['ripetiPassword'].value){
      this.authService.signUp(
        {
          nome:this.signupForm.controls['nome'].value,
          cognome:this.signupForm.controls['cognome'].value,
          email:this.signupForm.controls['email'].value,
          eta:this.signupForm.controls['eta'].value,
          password:this.signupForm.controls['password'].value
        }
      ).subscribe((user:any)=>{
        if(user){
          this.toastr.success("User registrato")
        this.signupForm.reset()
        this.section='login'
        }
      },err=>{
        this.toastr.error(err.error.message||"User non inserito")
      })
      }else{
        this.toastr.error("Completa il form o assicurati che le password coincidano")
      }
    }

    @HostListener('document:keydown.enter', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
      if(this.section=='login'){
        this.login()
      }else{
        this.signup()
      }
    }
}
