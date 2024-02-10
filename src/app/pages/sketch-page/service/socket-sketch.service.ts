import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { environment } from '../../../../environments/environment';
import { Subject } from 'rxjs';
import { SocketSketch } from '../../../core/models/socket/socket-sketch';

@Injectable({
  providedIn: 'root',
})
export class SocketSketchService {
  private _socket!: Socket;
  private _drawData$ = new Subject<SocketSketch>();
  private _roomUuid!: string;

  get drawData$() {
    return this._drawData$.asObservable();
  }

  get roomUuid() {
    return this._roomUuid;
  }

  initSocket(roomUuid: string) {
    this._socket = io(environment.SOCKET_URL, { transports: ['websocket'] });

    this._roomUuid = roomUuid;
    this._socket.emit('joinRoom', roomUuid);
    this._socket.on('draw', (socketSketch: SocketSketch) => {
      console.log(socketSketch);
      this._drawData$.next(socketSketch);
    });
  }

  sendDrawData(data: SocketSketch) {
    if (!this._socket || !this._roomUuid || !data) return;

    data.roomUuid = this._roomUuid;
    data.senderId = this._socket.id;
    this._socket.emit('draw', data);
  }

  unsubscribe() {
    if (!this._socket) return;
    this._socket.disconnect();
  }
}
