import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { ReactiveFormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatBadgeModule} from '@angular/material/badge';
import {MatMenuModule} from '@angular/material/menu';


@NgModule({
  declarations: [
   ChatComponent
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
ReactiveFormsModule,
MatIconModule,
MatBadgeModule,
MatMenuModule
  ],
  providers: [
  ],
  bootstrap: [ChatComponent]
})
export class ChatModule { }
