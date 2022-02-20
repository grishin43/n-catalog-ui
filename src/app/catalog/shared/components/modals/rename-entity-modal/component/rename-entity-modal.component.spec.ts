import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenameEntityModalComponent } from './rename-entity-modal.component';

describe('RenameEntityModalComponent', () => {
  let component: RenameEntityModalComponent;
  let fixture: ComponentFixture<RenameEntityModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenameEntityModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RenameEntityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
