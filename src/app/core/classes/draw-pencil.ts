import { signal } from '@angular/core';
import { ISketch } from './sketch/isketch';
import { DrawType, SketchService } from '../../pages/sketch-page/service/sketch.service';
import { SIZES } from '../../pages/sketch-page/service/sizes';
import { COLORS } from '../../pages/sketch-page/service/colors';
import { IColorableSketch } from './sketch/icolorable';
import { ISizableSketch } from './sketch/isizable';
import { SocketSketchService } from '../../pages/sketch-page/service/socket-sketch.service';
import { DrawModes } from '../../pages/sketch-page/sketch-page.component';

export class DrawPencil implements ISketch, IColorableSketch, ISizableSketch {
  private _isDrawing = signal(false);
  private _selectedFontSize = signal(SIZES[0]);
  private _selectedColor = signal(COLORS[0]);
  private _paths: any[] = [];
  private _bufferCtx!: CanvasRenderingContext2D;

  constructor(
    private _canvasParentHTML: HTMLElement,
    private _color: string = COLORS[0],
    private _fontSize: number = SIZES[0],
    private _sketchService: SketchService,
    private _socketSketchService: SocketSketchService
  ) {
    this._selectedColor.set(_color);
    this._selectedFontSize.set(_fontSize);
    this._bufferCtx = document.createElement('canvas').getContext('2d')!;
    this._bufferCtx.canvas.classList.add('remove-event');
    _canvasParentHTML.appendChild(this._bufferCtx.canvas);
  }

  public onMouseDown(ctx: CanvasRenderingContext2D, event: MouseEvent): void {
    this._bufferCtx.canvas.classList.remove('remove-event');
    this._paths = [];
    this._isDrawing.set(true);
    this._bufferCtx.canvas.width = ctx.canvas.width;
    this._bufferCtx.canvas.height = ctx.canvas.height;
    this._bufferCtx.canvas.style.left = `${ctx.canvas.offsetLeft}px`;
    this._bufferCtx.canvas.style.top = `${ctx.canvas.offsetTop}px`;
    this._sketchService.resetCanvasPath(this._bufferCtx);
    this._sketchService.clearCanvas(this._bufferCtx);
    this.draw(this._bufferCtx, event);
  }

  public onMouseUp(ctx: CanvasRenderingContext2D, event: MouseEvent): void {
    this._isDrawing.set(false);
    this._bufferCtx.canvas.classList.add('remove-event');
    this._sketchService.clearCanvas(this._bufferCtx);
    this._sketchService.resetCanvasPath(ctx);
    this._sketchService.closePathCanvasPath(ctx);
    this._sketchService.drawPaths(ctx, this._paths);
    this._socketSketchService.sendDrawData({
      drawMode: DrawModes.DRAW,
      data: this._paths
    });
    this._sketchService.resetCanvasPath(ctx);
    this._sketchService.closePathCanvasPath(ctx);
  }

  public onMouseMove(ctx: CanvasRenderingContext2D, event: MouseEvent): void {
    this.draw(this._bufferCtx, event);
  }

  private draw(ctx: CanvasRenderingContext2D, event: MouseEvent) {
    const option = {
      x: this._sketchService.getCanvasOffsetX(ctx) + event.clientX,
      y: this._sketchService.getCanvasOffsetY(ctx) + event.clientY,
      widthLine: this._selectedFontSize(),
      color: this._selectedColor(),
    };
    this._paths.push(option);
    this._sketchService.drawPath(ctx, option);
    
  }

  public isHold(): boolean {
    return this._isDrawing();
  }

  public setSize(size: number) {
    this._selectedFontSize.set(size);
  }

  public setColor(color: string) {
    this._selectedColor.set(color);
  }
}
