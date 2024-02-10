import { Injectable } from '@angular/core';
import { SIZES } from './sizes';

@Injectable({
  providedIn: 'root',
})
export class SketchService {
  readonly DEFAULT_COLOR: string = 'white';
  readonly DEFAULT_STROKE: number = SIZES[0];
  readonly CANVAS_WIDTH: number = 2000;
  readonly CANVAS_HEIGHT: number = 2000;

  constructor() {}

  drawBox(
    ctx: CanvasRenderingContext2D,
    rectangleOption: BoxOptions = {
      drawType: DrawType.FILL,
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      color: 'white',
    }
  ) {
    ctx.globalCompositeOperation = 'source-over';
    if (rectangleOption.drawType === DrawType.FILL) {
      ctx.fillStyle = rectangleOption.color;
      ctx.fillRect(
        rectangleOption.x,
        rectangleOption.y,
        rectangleOption.width,
        rectangleOption.height
      );
    } else {
      ctx.strokeStyle = rectangleOption.color;
      ctx.lineWidth = rectangleOption.strokeWidth ?? this.DEFAULT_STROKE;
      ctx.strokeRect(
        rectangleOption.x,
        rectangleOption.y,
        rectangleOption.width,
        rectangleOption.height
      );
    }
  }

  drawCircle(
    ctx: CanvasRenderingContext2D,
    circleOption: CircleOptions = {
      drawType: DrawType.FILL,
      centerX: 0,
      centerY: 0,
      radius: 100,
      color: 'white',
    }
  ) {
    ctx.beginPath();
    ctx.globalCompositeOperation = 'source-over';
    if (circleOption.drawType === DrawType.FILL) {
      ctx.fillStyle = circleOption.color;
      ctx.arc(
        circleOption.centerX,
        circleOption.centerY,
        circleOption.radius,
        0,
        Math.PI * 2
      );
      ctx.fill();
    } else {
      ctx.strokeStyle = circleOption.color;
      ctx.lineWidth = circleOption.strokeWidth ?? this.DEFAULT_STROKE;
      ctx.arc(
        circleOption.centerX,
        circleOption.centerY,
        circleOption.radius,
        0,
        Math.PI * 2
      );
      ctx.stroke();
    }
    ctx.closePath();
  }

  drawPath(ctx: CanvasRenderingContext2D, pathOptions: PathOptions) {
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = pathOptions.color ?? this.DEFAULT_COLOR;
    ctx.lineWidth = pathOptions.widthLine;
    ctx.lineCap = 'round';

    ctx.lineTo(pathOptions.x, pathOptions.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pathOptions.x, pathOptions.y);
    ctx.closePath();
  }

  drawPaths(ctx: CanvasRenderingContext2D, pathOptions: PathOptions[]) {
    if (pathOptions.length == 0) return;

    const firstPath = pathOptions[0];
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = firstPath.color ?? this.DEFAULT_COLOR;
    ctx.lineWidth = firstPath.widthLine;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(firstPath.x, firstPath.y);
    pathOptions.slice(1).forEach((p) => {
      ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();
    ctx.closePath();
  }

  drawLine(ctx: CanvasRenderingContext2D, lineOptions: LineOptions) {
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = lineOptions.color ?? this.DEFAULT_COLOR;
    ctx.lineWidth = lineOptions.widthLine;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(lineOptions.startX, lineOptions.startY);
    ctx.lineTo(lineOptions.endX, lineOptions.endY);
    ctx.stroke();
    ctx.closePath();
  }

  erase(ctx: CanvasRenderingContext2D, pathOptions: PathOptions) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = pathOptions.widthLine;
    ctx.lineCap = 'round';
    ctx.lineTo(pathOptions.x, pathOptions.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pathOptions.x, pathOptions.y);
  }

  erasePaths(ctx: CanvasRenderingContext2D, pathOptions: PathOptions[]) {
    if (pathOptions.length == 0) return;

    const option = pathOptions[0];
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = option.widthLine;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(option.x, option.y);
    pathOptions.slice(1).forEach((e) => {
      ctx.lineTo(e.x, e.y);
    });
    ctx.stroke();
    ctx.closePath();
  }

  resetCanvasPath(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
  }

  closePathCanvasPath(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
  }

  clearCanvas(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  addText(ctx: CanvasRenderingContext2D, fontSize: FontOptions) {
    ctx.font = `${fontSize.fontSize}px Arial`;
    ctx.fillStyle = fontSize.color ?? this.DEFAULT_COLOR;
    ctx.fillText(fontSize.text, fontSize.x, fontSize.y);
  }

  getCanvasOffsetX(ctx: CanvasRenderingContext2D) {
    return ctx.canvas.offsetLeft + -ctx.canvas.offsetLeft * 2;
  }

  getCanvasOffsetY(ctx: CanvasRenderingContext2D) {
    return ctx.canvas.offsetTop + -ctx.canvas.offsetTop * 2;
  }

  drawGrid(ctx: CanvasRenderingContext2D, gridOptions: GridOptions) {
    ctx.strokeStyle = gridOptions.gridColor;
    ctx.lineWidth = 0.5;
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    const scaledGridSize = gridOptions.gridSize;

    // Draw vertical lines
    for (let x = 0; x < ctx.canvas.width; x += scaledGridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ctx.canvas.height);
      ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y < ctx.canvas.height; y += scaledGridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(ctx.canvas.width, y);
      ctx.stroke();
    }
  }
}

export interface GridOptions {
  gridSize: number;
  gridColor: string;
}

export interface LineOptions {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  widthLine: number;
  color?: string;
}

export interface PathOptions {
  x: number;
  y: number;
  widthLine: number;
  color?: string;
}

export interface FontOptions {
  x: number;
  y: number;
  fontSize: number;
  text: string;
  color?: string;
}

export interface BoxOptions {
  drawType: DrawType;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  strokeWidth?: number;
}

export interface CircleOptions {
  drawType: DrawType;
  centerX: number;
  centerY: number;
  color: string;
  radius: number;
  strokeWidth?: number;
}

export enum DrawType {
  FILL = 'fill',
  OUTLINE = 'outline',
}
