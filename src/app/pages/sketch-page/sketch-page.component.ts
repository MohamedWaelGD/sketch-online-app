import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DrawType, SketchService } from './service/sketch.service';
import { CommonModule } from '@angular/common';
import { SIZES } from './service/sizes';
import { COLORS } from './service/colors';
import { DrawPencil } from '../../core/classes/draw-pencil';
import { Eraser } from '../../core/classes/eraser';
import { DrawText } from '../../core/classes/draw-text';
import { DrawLine } from '../../core/classes/draw-line';
import { DrawBox } from '../../core/classes/draw-box';
import { isColorableSketch } from '../../core/classes/sketch/icolorable';
import { isIDestroy } from '../../core/classes/sketch/idestroy';
import { isISizableSketch } from '../../core/classes/sketch/isizable';
import { isIDrawTypeSketch } from '../../core/classes/sketch/idraw-type';
import { DrawCircle } from '../../core/classes/draw-circle';
import { SocketSketchService } from './service/socket-sketch.service';
import { SocketSketch } from '../../core/models/socket/socket-sketch';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MoveCanvas } from '../../core/classes/move-canvas';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { v4 } from 'uuid';
import { SKETCH_COMPONENTS } from './components';
import { SketchFirebaseService } from './service/sketch-firebase.service';
import { debounceTime, take } from 'rxjs';

@Component({
  selector: 'app-sketch-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    SKETCH_COMPONENTS
  ],
  templateUrl: './sketch-page.component.html',
  styleUrl: './sketch-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SketchPageComponent implements OnInit, AfterViewInit, OnDestroy {
  drawModes = DrawModes;
  colorsList = signal(COLORS);
  fontSize = signal(SIZES);
  currentMode = signal(DrawModes.DRAW);

  private _mainCtx!: CanvasRenderingContext2D;
  private _gridCtx!: CanvasRenderingContext2D;
  private _sketchService = inject(SketchService);
  private _socket = inject(SocketSketchService);
  private _activatedRouter = inject(ActivatedRoute);
  private _router = inject(Router);
  private _snackBar = inject(MatSnackBar);
  private _sketchFirebase = inject(SketchFirebaseService);
  private _selectedColor = signal(this.colorsList()[0]);
  private _selectedSize = signal(this.fontSize()[0]);
  private _selectedDrawType = signal(DrawType.OUTLINE);
  private _sketch:
    | DrawPencil
    | Eraser
    | DrawText
    | DrawLine
    | DrawBox
    | DrawCircle
    | MoveCanvas
    | null = new MoveCanvas(this._sketchService);
  private _parentCanvas!: HTMLElement;
  private _drawSocket = signal<SocketSketch | null>(null);

  selectedColor = computed(() => this._selectedColor());
  selectedSize = computed(() => this._selectedSize());
  selectedDrawType = computed(() => this._selectedDrawType());

  ngOnInit(): void {
    this._activatedRouter.params.subscribe((res) => {
      let id = res['id'];
      if (!id) {
        this._router.navigate([`${v4()}`]);
      } else {
        this._socket.initSocket(id);
        this.onSocketData();
      }
    });
  }

  ngAfterViewInit(): void {
    this._mainCtx = (
      document.getElementById('sketch-canvas') as HTMLCanvasElement
    ).getContext('2d')!;
    this._parentCanvas = document.querySelector('.sketch-container')!;
    this.resizeCanvas();
    this.renderGridCanvas();
    this.setMode(DrawModes.MOVE);
    this.checkUpdatedImage();
    this.autoSaveCanvas();
  }

  ngOnDestroy(): void {
    this._socket.unsubscribe();
  }

  private autoSaveCanvas() {
    this._socket.updateData$.pipe(debounceTime(500)).subscribe(res => {
      console.log("uploading canvas...");
      const blob = this._sketchService.convertCanvasToImage(this._mainCtx);
      this._sketchFirebase.setImage(blob, this._socket.roomUuid);
    });
  }

  private checkUpdatedImage() {
    this._socket.connect$.subscribe((res) => {
      this._sketchFirebase.getImageBlob(this._socket.roomUuid).pipe(take(1)).subscribe({
        next: (res) => {
          if (res) {
            console.log('Updating Image...');
            this._sketchService.drawImage(this._mainCtx, res);
          }
        },
        error: (err) => {
          console.log('Room Canvas not found');
        },
      });
    });
  }

  private onSocketData() {
    this._socket.drawData$.subscribe((data) => {
      if (!data) return;
      console.log(`Type ${DrawModes[data.drawMode]}: ${data}`);

      if (data.drawMode != DrawModes.CLEAR) {
        this._drawSocket.set(data);
      }
      switch (data.drawMode) {
        case DrawModes.DRAW:
          this._sketchService.drawPaths(this._mainCtx, data.data);
          return;
        case DrawModes.CLEAR:
          this.clearCanvas();
          return;
        case DrawModes.ERASE:
          this._sketchService.erasePaths(this._mainCtx, data.data);
          return;
        case DrawModes.CIRCLE:
          this._sketchService.drawCircle(this._mainCtx, data.data);
          return;
        case DrawModes.BOX:
          this._sketchService.drawBox(this._mainCtx, data.data);
          return;
        case DrawModes.LINE:
          this._sketchService.drawLine(this._mainCtx, data.data);
          return;
      }
    });
  }

  private renderGridCanvas() {
    const canvas = document.getElementById('grid-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this._gridCtx = ctx;
    canvas.height = this._sketchService.CANVAS_HEIGHT;
    canvas.width = this._sketchService.CANVAS_WIDTH;

    this._sketchService.drawGrid(ctx, {
      gridSize: 50,
      gridColor: 'rgba(255, 255, 255, 0.1)',
    });
  }

  private resizeCanvas() {
    const canvas = document.getElementById(
      'sketch-canvas'
    ) as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this._mainCtx.canvas.height = this._sketchService.CANVAS_HEIGHT;
    this._mainCtx.canvas.width = this._sketchService.CANVAS_WIDTH;
  }

  @HostListener('window:resize', ['$event'])
  onResizeWindow(e: Event) {
    // this.resizeCanvas();
  }

  @HostListener('mousedown', ['$event'])
  private onMouseDown(e: MouseEvent) {
    if (!this._sketch || e.target !== this._mainCtx.canvas) return;

    this._sketch.onMouseDown(this._mainCtx, e);
  }

  @HostListener('mousemove', ['$event'])
  private onMouseMove(e: MouseEvent) {
    if (!this._sketch || !this._sketch.isHold()) return;

    this._sketch.onMouseMove(this._mainCtx, e);
  }

  @HostListener('mouseup', ['$event'])
  private onMouseUp(e: MouseEvent) {
    this._sketch?.onMouseUp(this._mainCtx, e);
  }

  public setMode(drawMode: DrawModes) {
    if (this._sketch && isIDestroy(this._sketch)) {
      this._sketch.destroyComponent(this._mainCtx);
    }
    this.currentMode.set(drawMode);
    switch (drawMode) {
      case DrawModes.MOVE:
        this._sketch = new MoveCanvas(this._sketchService);
        this._sketch.onMove$.subscribe((res) => {
          this._gridCtx.canvas.style.left = `${res.left}px`;
          this._gridCtx.canvas.style.top = `${res.top}px`;
        });
        return;
      case DrawModes.DRAW:
        this._sketch = new DrawPencil(
          this._parentCanvas,
          this._selectedColor(),
          this._selectedSize(),
          this._sketchService,
          this._socket
        );
        return;
      case DrawModes.ERASE:
        this._sketch = new Eraser(
          this._parentCanvas,
          this._selectedSize(),
          this._sketchService,
          this._socket
        );
        return;
      case DrawModes.CIRCLE:
        this._sketch = new DrawCircle(
          this._parentCanvas,
          this._selectedColor(),
          this._selectedSize(),
          this._selectedDrawType(),
          this._sketchService,
          this._socket
        );
        return;
      case DrawModes.BOX:
        this._sketch = new DrawBox(
          this._parentCanvas,
          this._selectedColor(),
          this._selectedSize(),
          this._selectedDrawType(),
          this._sketchService,
          this._socket
        );
        return;
      case DrawModes.LINE:
        this._sketch = new DrawLine(
          this._parentCanvas,
          this._selectedColor(),
          this._selectedSize(),
          this._sketchService,
          this._socket
        );
        return;
      case DrawModes.TEXT:
        this._sketch = new DrawText(
          this._selectedColor(),
          this._selectedSize(),
          this._sketchService
        );
        return;
    }
  }

  public clearCanvas(sendSocket: boolean = false) {
    this._sketchService.clearCanvas(this._mainCtx);
    if (sendSocket) {
      this._socket.sendDrawData({ drawMode: DrawModes.CLEAR });
    }
  }

  public onSelectColor(color: string) {
    this._selectedColor.set(color);
    if (isColorableSketch(this._sketch)) {
      this._sketch.setColor(color);
    }
  }

  public onSelectSize(size: number) {
    this._selectedSize.set(size);
    if (isISizableSketch(this._sketch)) {
      this._sketch.setSize(size);
    }
  }

  public onSelectDrawType(drawType: DrawType) {
    this._selectedDrawType.set(drawType);
    if (isIDrawTypeSketch(this._sketch)) {
      this._sketch.setDrawType(drawType);
    }
  }

  public copyUuid() {
    navigator.clipboard.writeText(this._socket.roomUuid);
    this._snackBar.open('Uuid is copy to clipboard', 'Close', {
      duration: 1500,
    });
  }
}

export enum DrawModes {
  DRAW,
  ERASE,
  TEXT,
  LINE,
  BOX,
  CIRCLE,
  CLEAR,
  MOVE,
}
