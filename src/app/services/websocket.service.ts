import { JsonPipe } from "@angular/common";
import { Injectable } from "@angular/core";
import { Stomp } from "@stomp/stompjs";
import * as SockJS from "sockjs-client";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  socket= new SockJS("/ws")
  stompClient = Stomp.over(this.socket);
  connect(message:any){
  this.stompClient.connect({},this.onConnect(message) , this.onError())
  }

  onConnect(message:any){
this.stompClient.subscribe('/topic/public',(data:any)=> {this.onMessageReceived(data)});

this.stompClient.send('/app/chat.addUser',{},JSON.stringify(message))
  }

  onMessageReceived(payload:any){
let message=JSON.parse(payload.body)
return message;
  }

  onError(){
    console.log("Refresh the page")
  }

sendMessage(message:any){
this.stompClient.send("/app/chat.sendMessage",{},JSON.stringify(message));
}
}
