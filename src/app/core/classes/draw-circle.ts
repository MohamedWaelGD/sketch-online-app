import { signal } from '@angular/core';
import { COLORS } from '../../pages/sketch-page/service/colors';
import { SIZES } from '../../pages/sketch-page/service/sizes';
import {
  DrawType,
  SketchService,
} from '../../pages/sketch-page/service/sketch.service';
import { IColorableSketch } from './sketch/icolorable';
import { IDestroy } from './sketch/idestroy';
import { IDrawTypeSketch } from './sketch/idraw-type';
import { ISizableSketch } from './sketch/isizable';
import { ISketch } from './sketch/isketch';
import { SocketSketchService } from '../../pages/sketch-page/service/socket-sketch.service';
import { DrawModes } from '../../pages/sketch-page/sketch-page.component';

export class DrawCircle
  implements
    ISketch,
    IColorableSketch,
    ISizableSketch,
    IDrawTypeSketch,
    IDestroy
{
  private _isDrawing = signal(false);
  private _selectedDrawType = signal(DrawType.OUTLINE);
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
    private _drawType: DrawType = DrawType.FILL,
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
    this._startX.set(this._sketchService.getCanvasOffsetX(ctx) + event.clientX);
    this._startY.set(this._sketchService.getCanvasOffsetY(ctx) + event.clientY);
    this._bufferCtx.canvas.width = ctx.canvas.width;
    this._bufferCtx.canvas.height = ctx.canvas.height;
    this._bufferCtx.canvas.style.left = `${ctx.canvas.offsetLeft}px`;
    this._bufferCtx.canvas.style.top = `${ctx.canvas.offsetTop}px`;
    this._sketchService.resetCanvasPath(ctx);
    this._sketchService.resetCanvasPath(this._bufferCtx);
    this._sketchService.clearCanvas(this._bufferCtx);
  }

  public onMouseUp(ctx: CanvasRenderingContext2D, event: MouseEvent): void {
    if (
      !(event.target === this._bufferCtx.canvas || event.target === ctx.canvas)
    )
      return;
    this._bufferCtx.canvas.classList.add('remove-event');
    this._isDrawing.set(false);
    this.drawCircle(ctx, event);
    this._sketchService.clearCanvas(this._bufferCtx);
    this._sketchService.resetCanvasPath(ctx);
    this._socketService.sendDrawData({
      drawMode: DrawModes.CIRCLE,
      data: this._lastEmittedCircle
    });
  }

  public onMouseMove(ctx: CanvasRenderingContext2D, event: MouseEvent): void {
    this._sketchService.clearCanvas(this._bufferCtx);
    this.drawCircle(this._bufferCtx, event);
  }

  private drawCircle(ctx: CanvasRenderingContext2D, event: MouseEvent) {
    const center = this.getCenterPoint(this._sketchService.getCanvasOffsetX(ctx) + event.clientX, this._sketchService.getCanvasOffsetY(ctx) + event.clientY, this._startX(), this._startY());
    const radius = this.calculateDistance(this._sketchService.getCanvasOffsetX(ctx) + event.clientX, this._sketchService.getCanvasOffsetY(ctx) + event.clientY, this._startX(), this._startY()) / 2;
    this._lastEmittedCircle = {
      drawType: this._selectedDrawType(),
      centerX: center.x,
      centerY: center.y,
      radius:  radius,
      color: this._selectedColor(),
      strokeWidth: this._selectedSize(),
    };
    this._sketchService.drawCircle(ctx, this._lastEmittedCircle);
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

  public setDrawType(drawType: DrawType): void {
    this._selectedDrawType.set(drawType);
  }

  public destroyComponent(): void {
    this._canvasParentHTML.removeChild(this._bufferCtx.canvas);
  }
  
  private getCenterPoint(x1: number, y1: number, x2: number, y2: number): { x: number, y: number } {
    const centerX = (x1 + x2) / 2;
    const centerY = (y1 + y2) / 2;
    return { x: centerX, y: centerY };
  }

  private calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
  
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
  
    return distance;
  }
}
