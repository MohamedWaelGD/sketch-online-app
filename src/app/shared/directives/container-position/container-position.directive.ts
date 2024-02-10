import {
  AfterViewInit,
  Directive,
  ElementRef,
  Renderer2,
  effect,
  input,
} from '@angular/core';

@Directive({
  selector: '[appContainerPosition]',
  standalone: true,
})
export class ContainerPositionDirective {
  position = input.required<'top' | 'left' | 'right' | 'bottom'>();

  constructor(private _el: ElementRef, private _renderer: Renderer2) {
    effect(()=>{
      if (this._el) {
        this._renderer.addClass(
          this._el.nativeElement,
          `${this.position()}-side-bar`
        );
      }
    })
  }
}
