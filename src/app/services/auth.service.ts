import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { AuthGuard } from "../core/auth.guard"
import { environment } from "../core/environment"
import { BehaviorSubject } from "rxjs"

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth:string ='/auth'
  private login:string ='/login'
  private signup:string ='/register'
  public token:string=''
  public refreshToken:string=''
  public subj:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

constructor(private http:HttpClient, private authGuard:AuthGuard){}

logIn(body:{}){
return this.http.post(environment.API_URL+this.auth+this.login,body)
  }
  signUp(body:{}){
    return this.http.post(environment.API_URL+this.auth+this.signup,body)
      }
      setToken(token:string){
this.token=token
      }
      setRefreshToken(refreshToken:string){
        this.refreshToken=refreshToken
              }
              authenticateUser(bool:boolean){
this.authGuard.authenticateUser(bool||undefined)
this.subj.next(bool)
              }
              verifyToken(token:string){
                return this.http.get(environment.API_URL+'/auth/'+token)
              }
              verifyRefreshToken(refreshToken:string){
                return this.http.get(environment.API_URL+'/auth/refreshToken/'+refreshToken)
              }
}
