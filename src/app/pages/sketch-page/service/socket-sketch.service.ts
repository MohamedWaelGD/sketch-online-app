import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { environment } from '../../../../environments/environment';
import { Subject } from 'rxjs';
import { SocketSketch } from '../../../core/models/socket/socket-sketch';

@Injectable({
  providedIn: 'root',
})
export class SocketSketchService {
  private _connection!: Socket;
  private _drawData$ = new Subject<SocketSketch>();
  private _updateData$ = new Subject<SocketSketch>();
  private _connect$ = new Subject();
  private _roomUuid!: string;

  get drawData$() {
    return this._drawData$.asObservable();
  }

  get updateData$() {
    return this._updateData$.asObservable();
  }

  get connect$() {
    return this._connect$.asObservable();
  }

  get roomUuid() {
    return this._roomUuid;
  }

  initSocket(roomUuid: string) {
    this._connection = io(environment.SOCKET_URL, { transports: ['websocket'] });

    this._roomUuid = roomUuid;
    this._connection.on('draw', (socketSketch: SocketSketch) => {
      this._drawData$.next(socketSketch);
    });

    this._connection.on('connect', () => {
      this._connection.emit('joinRoom', roomUuid);
      this._connect$.next(null);
      console.log('You connected');
    });

    this._connection.on('disconnect', (e) => {
      console.log('You disconnected');
    });
  }

  sendDrawData(data: SocketSketch) {
    if (!this._connection || !this._roomUuid || !data) return;

    data.roomUuid = this._roomUuid;
    data.senderId = this._connection.id;
    this._updateData$.next(data);
    this._connection.emit('draw', data);
  }

  unsubscribe() {
    if (!this._connection) return;
    this._connection.disconnect();
  }
}
