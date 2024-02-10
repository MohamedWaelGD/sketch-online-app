import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, computed, input, signal } from '@angular/core';
import { COLORS } from '../../../pages/sketch-page/service/colors';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ContainerPositionDirective } from '../../directives/container-position/container-position.directive';

@Component({
  selector: 'app-color-selection',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './color-selection.component.html',
  styleUrl: './color-selection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    { directive: ContainerPositionDirective, inputs: ['position']}
  ]
})
export class ColorSelectionComponent implements OnInit {

  initColor = input<string>();

  @Output() selectColor = new EventEmitter<string>();

  private _colorsList = signal(COLORS);
  private _selectedColor = signal(this._colorsList()[0]);

  colorsList = computed(() => this._colorsList());
  selectedColor = computed(() => this._selectedColor());

  ngOnInit(): void {
    if (this.initColor()) {
      this.onSelectColor(this.initColor()!);
    }
  }

  onSelectColor(color: string) {
    this._selectedColor.set(color);
    this.selectColor.emit(color);
  }
}
