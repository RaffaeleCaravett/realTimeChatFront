import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { AuthGuard } from "../core/auth.guard"
import { environment } from "../core/environment"

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private auth:string ='/auth'
  private users:string ='/user'
  private chat:string ='/chat'
  private messaggio:string ='/messaggio'
  private notification:string ='/notification'

constructor(private http:HttpClient, private authGuard:AuthGuard){}

getUsers(page?:number){
  if(!page)
  return this.http.get(environment.API_URL+this.auth+this.users)
else
return this.http.get(environment.API_URL+this.auth+this.users+`?page=${page}`)
}
getChatByStarterId(userId:any){
return this.http.get(environment.API_URL+this.chat+`/starter/${userId}`)
}
getChatByPartecipantId(userId:any){
return this.http.get(environment.API_URL+this.chat+`/partecipant/${userId}`)
}
saveChat(chat:any){
  return this.http.post(environment.API_URL+this.chat,chat)
}
saveGroupChat(chat:any){
  return this.http.post(environment.API_URL+this.chat+'/group',chat)
}
saveMessaggio(messaggio:any){
  return this.http.post(environment.API_URL+this.messaggio,messaggio)
}
putMessaggio(id:number,messaggio:any){
  return this.http.put(environment.API_URL+this.messaggio+`/${id}`,messaggio)
}
deleteMessaggio(id:number){
  return this.http.delete(environment.API_URL+this.messaggio+`/${id}`)
}
getMessaggiByChatId(id:number){
return this.http.get(environment.API_URL+this.messaggio+`/chat/${id}`)
}
getNotificationsByChatIdAndNotificationState(chatId:number,notificationState:string){
return this.http.get(environment.API_URL+this.notification+`/chatAndStato?chat_id=${chatId}&statoNotifica=${notificationState}`)
}
putNotification(notificationId:number,notification:{}){
  return this.http.put(environment.API_URL+this.notification+`/${notificationId}`,notification)
}
getAllUsersList(){
  return this.http.get(environment.API_URL+this.users)
}
}
