import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: Socket;
  private isConnectedSubject = new BehaviorSubject<boolean>(false);
  isConnected$ = this.isConnectedSubject.asObservable();

  constructor() {
    this.socket = io('http://localhost:3000');
    this.socket.on('connect', () => {
      console.info('Connected to the WebSocket');
      this.isConnectedSubject.next(true);
    });
    this.socket.on('disconnect', (reason) => {
      console.error('Disconnected from the WebSocket', reason);
      this.isConnectedSubject.next(false);
    });
  }

  botResponse(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('bot-response', (msg: string) => {
        observer.next(msg);
      });
    });
  }

  sendMessage(userMessage: string): void {
    if (this.socket.connected) {
      this.socket.emit('user-message', userMessage);
    } else {
      console.warn('Cannot send message, socket not connected');
    }
  }

  botTyping(): Observable<boolean> {
    return new Observable((observer) => {
      this.socket.on('bot-typing', () => {
        observer.next(true);
      });
    });
  }

  disconnect(): void {
    console.warn('Disconnecting WebSocket');
    this.socket.disconnect();
  }
}
