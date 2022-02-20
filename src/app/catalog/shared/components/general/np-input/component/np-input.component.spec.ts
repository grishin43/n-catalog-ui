import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NpInputComponent } from './np-input.component';

describe('NpInputComponent', () => {
  let component: NpInputComponent;
  let fixture: ComponentFixture<NpInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NpInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NpInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
