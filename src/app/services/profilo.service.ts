import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { environment } from "../core/environment"

@Injectable({
  providedIn: 'root'
})
export class ProfiloService {

  private user:string ='/user'
  private chat:string ='/chat'
  private messaggio:string ='/messaggio'


constructor(private http:HttpClient){}


getUserById(userId:number){
  return this.http.get(environment.API_URL+this.user+'/'+userId)
}
modifyUserById(userId:number,user:{}){
  return this.http.put(environment.API_URL+this.user+'/'+userId,user)
}
deleteUserById(userId:number){
  return this.http.delete(environment.API_URL+this.user+'/'+userId)
}
getChatByStarterId(userId:any){
  return this.http.get(environment.API_URL+this.chat+`/starter/${userId}`)
  }
  getChatByPartecipantId(userId:any){
  return this.http.get(environment.API_URL+this.chat+`/partecipant/${userId}`)
  }
  getMessagesBySenderId(userId:any){
    return this.http.get(environment.API_URL+this.messaggio+`/sender/${userId}`)
    }
}
