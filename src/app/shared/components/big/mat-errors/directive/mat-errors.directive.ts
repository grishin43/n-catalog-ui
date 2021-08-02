import {
  AfterViewInit,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Directive, HostListener,
  OnDestroy,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import {MatErrorsComponent} from '../component/mat-errors.component';
import {MatFormField} from '@angular/material/form-field';
import {Subscription} from 'rxjs';

@Directive({
  selector: '[npMatErrors]'
})
export class MatErrorsDirective implements OnInit, OnDestroy, AfterViewInit {
  private ref: ComponentRef<MatErrorsComponent>;
  private subs = new Subscription();
  private formGroupNode: HTMLElement;

  constructor(
    private vcr: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private formField: MatFormField
  ) {
  }

  ngOnInit(): void {
    this.vcr.element.nativeElement.parentNode.classList.add('np-mat-errors');
    const componentFactory: ComponentFactory<MatErrorsComponent> = this.resolver.resolveComponentFactory(MatErrorsComponent);
    this.ref = this.vcr.createComponent(componentFactory);
    this.formGroupNode = this.vcr.element.nativeElement.closest('.form-group');
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.subs.add(
      this.formField?._control?.ngControl.statusChanges
        .subscribe(() => {
          this.setErrors();
        })
    );
  }

  @HostListener('blur')
  setErrors(): void {
    const errors = this.formField?._control?.ngControl.errors;
    this.ref.instance.errors = errors;
    if (this.formGroupNode) {
      errors ? this.formGroupNode.classList.add('has-errors') : this.formGroupNode.classList.remove('has-errors');
    }
  }


}
