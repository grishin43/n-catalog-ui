import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarActionBtnComponent } from './toolbar-action-btn.component';

describe('ToolbarActionBtnComponent', () => {
  let component: ToolbarActionBtnComponent;
  let fixture: ComponentFixture<ToolbarActionBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolbarActionBtnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarActionBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
