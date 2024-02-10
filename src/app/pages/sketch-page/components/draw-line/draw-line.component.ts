import { ChangeDetectionStrategy, Component, EventEmitter, Output, input } from '@angular/core';
import { SizeSelectionComponent } from '../../../../shared/components/size-selection/size-selection.component';
import { ColorSelectionComponent } from '../../../../shared/components/color-selection/color-selection.component';

@Component({
  selector: 'app-draw-line',
  standalone: true,
  imports: [ColorSelectionComponent, SizeSelectionComponent],
  templateUrl: './draw-line.component.html',
  styleUrl: './draw-line.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DrawLineComponent {

  initColor = input<string>();
  initSize = input<number>();

  @Output() selectColor = new EventEmitter<string>();
  @Output() selectSize = new EventEmitter<number>();
}
