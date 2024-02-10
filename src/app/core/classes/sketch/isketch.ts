export interface ISketch {
  onMouseDown(ctx: CanvasRenderingContext2D, event: MouseEvent): void;
  onMouseUp(ctx: CanvasRenderingContext2D, event: MouseEvent): void;
  onMouseMove(ctx: CanvasRenderingContext2D, event: MouseEvent): void;
  isHold(): boolean;
}

