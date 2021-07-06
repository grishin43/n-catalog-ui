import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NpButtonComponent } from './np-button.component';

describe('NpButtonComponent', () => {
  let component: NpButtonComponent;
  let fixture: ComponentFixture<NpButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NpButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NpButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
