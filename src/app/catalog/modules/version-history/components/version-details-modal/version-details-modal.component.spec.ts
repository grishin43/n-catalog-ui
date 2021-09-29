import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionDetailsModalComponent } from './version-details-modal.component';

describe('VersionDetailsModalComponent', () => {
  let component: VersionDetailsModalComponent;
  let fixture: ComponentFixture<VersionDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VersionDetailsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VersionDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
