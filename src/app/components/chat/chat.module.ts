import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { WebsocketService } from 'src/app/services/websocket.service';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
   ChatComponent
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
ReactiveFormsModule
  ],
  providers: [
  ],
  bootstrap: [ChatComponent]
})
export class ChatModule { }
