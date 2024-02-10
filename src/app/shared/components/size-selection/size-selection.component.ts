import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, computed, input, signal } from '@angular/core';
import { COLORS } from '../../../pages/sketch-page/service/colors';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ContainerPositionDirective } from '../../directives/container-position/container-position.directive';
import { SIZES } from '../../../pages/sketch-page/service/sizes';

@Component({
  selector: 'app-size-selection',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './size-selection.component.html',
  styleUrl: './size-selection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    { directive: ContainerPositionDirective, inputs: ['position']}
  ]
})
export class SizeSelectionComponent implements OnInit {

  initSize = input<number>();

  @Output() selectSize = new EventEmitter<number>();

  private _sizesList = signal(SIZES);
  private _selectedSize = signal(this._sizesList()[0]);

  sizesList = computed(() => this._sizesList());
  selectedSize = computed(() => this._selectedSize());

  ngOnInit(): void {
    if (this.initSize()) {
      this.onSelectSize(this.initSize()!);
    }
  }

  onSelectSize(size: number) {
    this._selectedSize.set(size);
    this.selectSize.emit(size);
  }
}
