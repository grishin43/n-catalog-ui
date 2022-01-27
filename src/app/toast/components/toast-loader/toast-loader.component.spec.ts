import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastLoaderComponent } from './toast-loader.component';

describe('ToastLoaderComponent', () => {
  let component: ToastLoaderComponent;
  let fixture: ComponentFixture<ToastLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToastLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToastLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
