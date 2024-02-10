import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
  computed,
  input,
  signal,
} from '@angular/core';
import { ContainerPositionDirective } from '../../directives/container-position/container-position.directive';
import { DrawType } from '../../../pages/sketch-page/service/sketch.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-draw-type-selection',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIcon],
  templateUrl: './draw-type-selection.component.html',
  styleUrl: './draw-type-selection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    { directive: ContainerPositionDirective, inputs: ['position'] },
  ],
})
export class DrawTypeSelectionComponent implements OnInit {

  initDrawType = input<DrawType>();

  @Output() selectDrawType = new EventEmitter<DrawType>();

  private _drawTypeList = signal<DrawTypeSelectionOption[]>([
    { drawType: DrawType.OUTLINE, icon: 'check_box_outline_blank'},
    { drawType: DrawType.FILL, icon: 'format_color_fill'},
  ]);
  private _selectedDrawType = signal(DrawType.OUTLINE);

  drawTypeList = computed(() => this._drawTypeList());
  selectedDrawType = computed(() => this._selectedDrawType());

  ngOnInit(): void {
    if (this.initDrawType()) {
      this.onSelectDrawType(this.initDrawType()!);
    }
  }

  onSelectDrawType(drawType: DrawType) {
    this._selectedDrawType.set(drawType);
    this.selectDrawType.emit(drawType);
  }
}

export interface DrawTypeSelectionOption {
  drawType: DrawType;
  icon: string;
}