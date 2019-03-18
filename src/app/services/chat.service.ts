import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { WebsocketService} from './websocket.service';
import { environment } from '../../environments/environment';

export interface Message{
  author: string;
  chatmessage: string;
}

@Injectable()
export class ChatService {

  public messages: Subject<Message>;

  constructor(
    private wsService: WebsocketService
    ) { 
      this.messages = <Subject<Message>>wsService
      .connect(environment.CHAT_URL)
      .map((response:MessageEvent): Message => {
        let data = JSON.parse(response.data);
        return{
          author: data.author,
          chatmessage: data.message
        }
      })
    }

}
