import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[npMaxLength]'
})
export class MaxLengthDirective {
  @Input() npMaxLength: string;

  constructor(private el: ElementRef) {
  }

  @HostListener('input') onInput(): void {
    const length = this.el?.nativeElement?.value?.length;
    if (length >= +this.npMaxLength) {
      this.el.nativeElement.value = this.el.nativeElement.value.substr(0, +this.npMaxLength);
    }
  }


}
