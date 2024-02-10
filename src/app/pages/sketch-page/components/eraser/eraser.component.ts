import { ChangeDetectionStrategy, Component, EventEmitter, Output, input } from '@angular/core';
import { SizeSelectionComponent } from '../../../../shared/components/size-selection/size-selection.component';

@Component({
  selector: 'app-eraser',
  standalone: true,
  imports: [SizeSelectionComponent],
  templateUrl: './eraser.component.html',
  styleUrl: './eraser.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EraserComponent {

  initSize = input<number>();
  
  @Output() selectSize = new EventEmitter<number>();

}
