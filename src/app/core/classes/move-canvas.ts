import { signal } from '@angular/core';
import { ISketch } from './sketch/isketch';
import { SketchService } from '../../pages/sketch-page/service/sketch.service';
import { IDestroy } from './sketch/idestroy';
import { Subject } from 'rxjs';

export class MoveCanvas implements ISketch, IDestroy {
  private _isMoving = signal(false);
  private _startX: number = 0;
  private _startY: number = 0;
  private _initialX: number = 0;
  private _initialY: number = 0;
  private readonly SPEED: number = 1;

  private _onMove = new Subject<Position>();

  get onMove$() {
    return this._onMove.asObservable();
  }

  constructor(private _sketch: SketchService) {}

  public onMouseDown(ctx: CanvasRenderingContext2D, event: MouseEvent): void {
    this._isMoving.set(true);
    ctx.canvas.classList.remove('grabbing-cursor');
    ctx.canvas.classList.add('grab-cursor');
    this._initialX = ctx.canvas.offsetLeft;
    this._initialY = ctx.canvas.offsetTop;
    this._startX = event.clientX;
    this._startY = event.clientY;
  }

  public onMouseUp(ctx: CanvasRenderingContext2D, event: MouseEvent): void {
    ctx.canvas.classList.add('grabbing-cursor');
    ctx.canvas.classList.remove('grab-cursor');
    this._isMoving.set(false);
  }

  public onMouseMove(ctx: CanvasRenderingContext2D, event: MouseEvent): void {
    this.move(ctx, event);
  }

  private move(ctx: CanvasRenderingContext2D, event: MouseEvent) {
    const top = this.getNewTopPosition(ctx, event);
    const left = this.getNewLeftPosition(ctx, event);
    ctx.canvas.style.top = `${top}px`;
    ctx.canvas.style.left = `${left}px`;
    this._onMove.next({ top: top, left: left });
  }

  private getNewTopPosition(ctx: CanvasRenderingContext2D, event: MouseEvent) {
    const deltaY = (this._startY - event.clientY) * this.SPEED;
    let newTopPos = this._initialY - deltaY;
    if (newTopPos > 0) {
      newTopPos = 0;
    } else if (window.innerHeight - newTopPos > this._sketch.CANVAS_HEIGHT) {
      newTopPos = ctx.canvas.offsetTop;
    }
    return newTopPos;
  }

  private getNewLeftPosition(ctx: CanvasRenderingContext2D, event: MouseEvent) {
    const deltaX = (this._startX - event.clientX) * this.SPEED;
    let newLeftPos = this._initialX - deltaX;
    if (newLeftPos > 0) {
      newLeftPos = 0;
    } else if (window.innerWidth - newLeftPos > this._sketch.CANVAS_WIDTH) {
      newLeftPos = ctx.canvas.offsetLeft;
    }
    return newLeftPos;
  }

  public isHold(): boolean {
    return this._isMoving();
  }

  public destroyComponent(ctx: CanvasRenderingContext2D): void {
    ctx.canvas.classList.remove('grabbing-cursor');
    ctx.canvas.classList.remove('grab-cursor');
    this._onMove.complete();
  }
}

export interface Position {
  left: number;
  top: number;
}