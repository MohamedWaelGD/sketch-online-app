import { signal } from '@angular/core';
import { SIZES } from '../../pages/sketch-page/service/sizes';
import { SketchService } from '../../pages/sketch-page/service/sketch.service';
import { ISketch } from './sketch/isketch';
import { ISizableSketch } from './sketch/isizable';
import { SocketSketchService } from '../../pages/sketch-page/service/socket-sketch.service';
import { DrawModes } from '../../pages/sketch-page/sketch-page.component';

export class Eraser implements ISketch, ISizableSketch {
  private _isDrawing = signal(false);
  private _selectedFontSize = signal(SIZES[0]);
  private _paths: any[] = [];

  constructor(
    private _fontSize: number = SIZES[0],
    private _sketchService: SketchService,
    private _socketSketchService: SocketSketchService
  ) {
    this._selectedFontSize.set(_fontSize);
  }

  public onMouseDown(ctx: CanvasRenderingContext2D, event: MouseEvent): void {
    this._paths = [];
    this._isDrawing.set(true);
    this._sketchService.resetCanvasPath(ctx);
    this.erase(ctx, event);
  }

  public onMouseUp(ctx: CanvasRenderingContext2D, event: MouseEvent): void {
    this._isDrawing.set(false);
    this._sketchService.closePathCanvasPath(ctx);
    this._socketSketchService.sendDrawData({
      drawMode: DrawModes.ERASE,
      data: this._paths
    });
  }

  public onMouseMove(ctx: CanvasRenderingContext2D, event: MouseEvent): void {
    this.erase(ctx, event);
  }

  private erase(ctx: CanvasRenderingContext2D, event: MouseEvent): void {
    const option = {
      x: this._sketchService.getCanvasOffsetX(ctx) + event.clientX,
      y: this._sketchService.getCanvasOffsetY(ctx) + event.clientY,
      widthLine: this._selectedFontSize(),
    };
    this._paths.push(option);
    this._sketchService.erase(ctx, option);
  }

  public isHold(): boolean {
    return this._isDrawing();
  }

  public setSize(size: number) {
    this._selectedFontSize.set(size);
  }
}
