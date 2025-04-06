import { Component } from '@angular/core';
import { WebSocketService } from './services/web-socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  userMessage = '';
  chatHistory: { user: 'human' | 'bot'; message: string }[] = [];
  isTyping = false;
  isConnected = false;
  connectionError: string | null = null;
  private subscriptions: Subscription[] = [];

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.isConnectedSubscription(),
      this.botResponseSubscription(),
      this.botTypingSubscription()
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.webSocketService.disconnect();
  }

  isConnectedSubscription() {
    return this.webSocketService.isConnected$.subscribe((connected) => {
      this.isConnected = connected;
      this.connectionError = connected
        ? null
        : '⚠️ Disconnected from the server';
    });
  }

  botResponseSubscription() {
    return this.webSocketService.botResponse().subscribe({
      next: (message: string) => {
        this.isTyping = false;
        this.chatHistory.push({ user: 'bot', message });
      },
      error: (err) => console.error('Socket Error', err),
      complete: () => console.log('Socket request completed.'),
    });
  }

  botTypingSubscription() {
    return this.webSocketService.botTyping().subscribe((isTyping) => {
      this.isTyping = isTyping;
    });
  }

  sendMessage() {
    if (this.userMessage.trim()) {
      this.webSocketService.sendMessage(this.userMessage);
      this.chatHistory.push({
        user: 'human',
        message: this.userMessage.toString(),
      });
      this.userMessage = '';
    }
  }
}
