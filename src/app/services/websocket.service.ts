import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { Observable, Subject } from "rxjs";
import { environment } from "../core/environment";
import * as SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

stompClient:any
topic:string = "/topic/chat";
responseSubject = new Subject<any>();
webSocketEndPoint:string = environment.API_URL+"/ws";

  constructor(private socket: Socket) { }

  connect(){
console.log("Initialize websocket connection");
let ws = SockJS(this.webSocketEndPoint);
this.stompClient=Stomp.over(ws);

const _this=this;
_this.stompClient.connect({}, function(frame:any){
  _this.stompClient.subscribe(_this.topic,function(chatResponse:any){
    _this.onMessageReceived(chatResponse);
  });
},this.errorCallBack);
}

disconnect(){
  if(this.stompClient!=null){
    this.stompClient.disconnect();
  }
  console.log("Disconnected")
}

errorCallBack(error:any){
  console.log("errorCallBack => " + error)
  setTimeout(()=>{
    this.connect();
  },5000);
}

send(message:any){
  console.log("calling logout api via web socket");
  this.stompClient.send("/app/greet",{}, JSON.stringify(message));
}

onMessageReceived(message:any){
  console.log("Message received from server : " + message.body);
  const obj = JSON.parse(message.body);
  this.responseSubject.next(obj);
}
}
