import {Directive, HostListener, Input} from '@angular/core';
import {NgControl} from '@angular/forms';

@Directive({
  selector: '[npMaxLength]'
})
export class MaxLengthDirective {
  @Input() npMaxLength: string;

  constructor(private control: NgControl) {
  }

  @HostListener('input') onInput(): void {
    const value = this.control.control.value;
    const length = value?.length;
    if (length >= +this.npMaxLength) {
      const newValue = value.substr(0, +this.npMaxLength);
      this.control.control.setValue(newValue);
    }
  }

}
