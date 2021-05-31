import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NpStatusPillComponent } from './np-status-pill.component';

describe('NpStatusPillComponent', () => {
  let component: NpStatusPillComponent;
  let fixture: ComponentFixture<NpStatusPillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NpStatusPillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NpStatusPillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
