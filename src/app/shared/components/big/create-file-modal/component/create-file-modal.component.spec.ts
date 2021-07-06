import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFileModalComponent } from './create-file-modal.component';

describe('CreateFileModalComponent', () => {
  let component: CreateFileModalComponent;
  let fixture: ComponentFixture<CreateFileModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateFileModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
