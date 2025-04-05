import { Component } from '@angular/core';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  socket: any;
  userMessage = '';
  botMessage = '';

  ngOnInit(): void {
    this.socket = io('http://localhost:3000');
    this.socket.on('bot-response', (msg: string) => {
      this.botMessage = msg;
    });
  }

  sendMessage() {
    if (this.userMessage.trim()) {
      this.socket.emit('user-message', this.userMessage);
      this.userMessage = '';
    }
  }
}
