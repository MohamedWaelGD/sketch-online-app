import { signal } from '@angular/core';
import { COLORS } from '../../pages/sketch-page/service/colors';
import { SIZES } from '../../pages/sketch-page/service/sizes';
import { SketchService } from '../../pages/sketch-page/service/sketch.service';
import {
  ISketch
} from './sketch/isketch';
import { IColorableSketch } from './sketch/icolorable';
import { IDestroy } from './sketch/idestroy';
import { ISizableSketch } from './sketch/isizable';
import { SocketSketchService } from '../../pages/sketch-page/service/socket-sketch.service';
import { DrawModes } from '../../pages/sketch-page/sketch-page.component';

export class DrawLine
  implements ISketch, IColorableSketch, ISizableSketch, IDestroy
{
  private _isDrawing = signal(false);
  private _selectedSize = signal(SIZES[0]);
  private _selectedColor = signal(COLORS[0]);
  private _startX = signal(0);
  private _startY = signal(0);
  private _bufferCtx!: CanvasRenderingContext2D;
  private _lastEmittedCircle: any;

  constructor(
    private _canvasParentHTML: HTMLElement,
    private _color: string = COLORS[0],
    private _size: number = SIZES[0],
    private _sketchService: SketchService,
    private _socketService: SocketSketchService
  ) {
    this._selectedColor.set(_color);
    this._selectedSize.set(_size);
    this._bufferCtx = document.createElement('canvas').getContext('2d')!;
    this._bufferCtx.canvas.classList.add('remove-event');
    _canvasParentHTML.appendChild(this._bufferCtx.canvas);
  }

  public onMouseDown(ctx: CanvasRenderingContext2D, event: MouseEvent): void {
    this._bufferCtx.canvas.classList.remove('remove-event');
    this._isDrawing.set(true);
    this._startX.set(event.clientX);
    this._startY.set(event.clientY);
    this._bufferCtx.canvas.width = ctx.canvas.width;
    this._bufferCtx.canvas.height = ctx.canvas.height;
    this._bufferCtx.canvas.style.left = `${ctx.canvas.offsetLeft}px`;
    this._bufferCtx.canvas.style.top = `${ctx.canvas.offsetTop}px`;
    this._sketchService.resetCanvasPath(ctx);
    this._sketchService.resetCanvasPath(this._bufferCtx);
    this._sketchService.clearCanvas(this._bufferCtx);
  }

  public onMouseUp(ctx: CanvasRenderingContext2D, event: MouseEvent): void {
    if (!(event.target === this._bufferCtx.canvas || event.target === ctx.canvas)) return;
    this._bufferCtx.canvas.classList.add('remove-event');
    this._isDrawing.set(false);
    this.drawLine(ctx, event);
    this._sketchService.clearCanvas(this._bufferCtx);
    this._sketchService.resetCanvasPath(ctx);
    this._socketService.sendDrawData({
      drawMode: DrawModes.LINE,
      data: this._lastEmittedCircle
    });
  }

  public onMouseMove(ctx: CanvasRenderingContext2D, event: MouseEvent): void {
    this._sketchService.clearCanvas(this._bufferCtx);
    this.drawLine(this._bufferCtx, event);
  }

  private drawLine(ctx: CanvasRenderingContext2D, event: MouseEvent) {
    this._lastEmittedCircle = {
      startX: this._sketchService.getCanvasOffsetX(ctx) + this._startX(),
      startY: this._sketchService.getCanvasOffsetY(ctx) + this._startY(),
      endX: this._sketchService.getCanvasOffsetX(ctx) +  event.clientX,
      endY: this._sketchService.getCanvasOffsetY(ctx) + event.clientY,
      widthLine: this._selectedSize(),
      color: this._selectedColor(),
    };
    this._sketchService.drawLine(ctx, this._lastEmittedCircle);
  }

  public isHold(): boolean {
    return this._isDrawing();
  }

  public setSize(size: number) {
    this._selectedSize.set(size);
  }

  public setColor(color: string) {
    this._selectedColor.set(color);
  }
  
  public destroyComponent(): void {
    this._canvasParentHTML.removeChild(this._bufferCtx.canvas);
  }
}
