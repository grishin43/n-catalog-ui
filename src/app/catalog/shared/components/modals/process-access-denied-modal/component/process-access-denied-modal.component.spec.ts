import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProcessAccessDeniedModalComponent} from './process-access-denied-modal.component';

describe('AccessDeniedModalComponent', () => {
  let component: ProcessAccessDeniedModalComponent;
  let fixture: ComponentFixture<ProcessAccessDeniedModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProcessAccessDeniedModalComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessAccessDeniedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
