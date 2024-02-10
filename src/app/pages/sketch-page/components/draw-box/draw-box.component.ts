import { ChangeDetectionStrategy, Component, EventEmitter, Output, input } from '@angular/core';
import { ColorSelectionComponent } from '../../../../shared/components/color-selection/color-selection.component';
import { DrawTypeSelectionComponent } from '../../../../shared/components/draw-type-selection/draw-type-selection.component';
import { SizeSelectionComponent } from '../../../../shared/components/size-selection/size-selection.component';
import { DrawType } from '../../service/sketch.service';

@Component({
    selector: 'app-draw-box',
    standalone: true,
    templateUrl: './draw-box.component.html',
    styleUrl: './draw-box.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ColorSelectionComponent, SizeSelectionComponent, DrawTypeSelectionComponent]
})
export class DrawBoxComponent {

  initColor = input<string>();
  initSize = input<number>();
  initDrawType = input<DrawType>();
  
  @Output() selectColor = new EventEmitter<string>();
  @Output() selectSize = new EventEmitter<number>();
  @Output() selectDrawType = new EventEmitter<DrawType>();

}
