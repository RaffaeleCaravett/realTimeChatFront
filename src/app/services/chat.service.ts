import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { AuthGuard } from "../core/auth.guard"
import { environment } from "../core/environment"
import { BehaviorSubject } from "rxjs"

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private auth:string ='/auth'
  private users:string ='/user'

constructor(private http:HttpClient, private authGuard:AuthGuard){}

getUsers(page?:number){
  if(!page)
  return this.http.get(environment.API_URL+this.auth+this.users)
else
return this.http.get(environment.API_URL+this.auth+this.users+`?page=${page}`)
}
}
