import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreventProcessCloseModalComponent } from './prevent-process-close-modal.component';

describe('PreventCloseModalComponent', () => {
  let component: PreventProcessCloseModalComponent;
  let fixture: ComponentFixture<PreventProcessCloseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreventProcessCloseModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreventProcessCloseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
