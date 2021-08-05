import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessToolbarComponent } from './process-toolbar.component';

describe('ProcessToolbarComponent', () => {
  let component: ProcessToolbarComponent;
  let fixture: ComponentFixture<ProcessToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessToolbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
