import { Component, OnInit } from '@angular/core';
import { WebsocketService } from "../services/websocket.service";
import { ChatService } from "../services/chat.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor(
    private chatService: ChatService
  ) {
    chatService.messages.subscribe(msg => {
      console.log("Response from websocket: " + msg);
    });
   }

  ngOnInit() {
  }

  private message = {
    author: "tutorialedge",
    chatmessage: "this is a test message"
  };

  sendMsg() {
    console.log("new message from client to websocket: ", this.message);
    this.chatService.messages.next(this.message);
    this.message.chatmessage = "";
  }
  

}
