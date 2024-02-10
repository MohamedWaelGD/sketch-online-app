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

  constructor(
    private _color: string = COLORS[0],
    private _fontSize: number = SIZES[0],
    private _sketchService: SketchService,
    private _socketSketchService: SocketSketchService
  ) {
    this._selectedColor.set(_color);
    this._selectedFontSize.set(_fontSize);
  }

  public onMouseDown(ctx: CanvasRenderingContext2D, event: MouseEvent): void {
    this._paths = [];
    this._isDrawing.set(true);
    this._sketchService.resetCanvasPath(ctx);
    this.draw(ctx, event);
  }

  public onMouseUp(ctx: CanvasRenderingContext2D, event: MouseEvent): void {
    this._isDrawing.set(false);
    this._sketchService.closePathCanvasPath(ctx);
    this._socketSketchService.sendDrawData({
      drawMode: DrawModes.DRAW,
      data: this._paths
    });
  }

  public onMouseMove(ctx: CanvasRenderingContext2D, event: MouseEvent): void {
    this.draw(ctx, event);
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
