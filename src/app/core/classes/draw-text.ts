import { signal } from "@angular/core";
import { COLORS } from "../../pages/sketch-page/service/colors";
import { SIZES } from "../../pages/sketch-page/service/sizes";
import { SketchService } from "../../pages/sketch-page/service/sketch.service";
import { ISketch } from "./sketch/isketch";
import { ISizableSketch } from "./sketch/isizable";

export class DrawText implements ISketch, ISizableSketch {
    private _isDrawing = signal(false);
    private _selectedFontSize = signal(SIZES[0]);
    private _selectedColor = signal(COLORS[0]);
  
    constructor(
      private _color: string = COLORS[0],
      private _fontSize: number = SIZES[0],
      private _sketchService: SketchService
    ) {
      this._selectedColor.set(_color);
      this._selectedFontSize.set(_fontSize);
    }

    onMouseDown(ctx: CanvasRenderingContext2D, event: MouseEvent): void {
        
    }

    onMouseUp(ctx: CanvasRenderingContext2D, event: MouseEvent): void {
        
    }

    onMouseMove(ctx: CanvasRenderingContext2D, event: MouseEvent): void {
        
    }

    isHold(): boolean {
        return false;
    }

    setSize(size: number): void {
        
    }

}