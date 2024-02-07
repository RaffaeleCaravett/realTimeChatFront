import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  constructor(private socket: Socket) { }

  connectToChat(chatId: string): void {
    this.socket.connect();
    this.socket.emit('subscribe', chatId);
  }

  onMessageReceived(): Observable<any> {
    return this.socket.fromEvent('message');
  }
}
