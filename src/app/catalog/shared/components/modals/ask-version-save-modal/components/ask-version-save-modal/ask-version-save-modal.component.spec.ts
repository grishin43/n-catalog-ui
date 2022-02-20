import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskVersionSaveModalComponent } from './ask-version-save-modal.component';

describe('AskVersionSaveModalComponent', () => {
  let component: AskVersionSaveModalComponent;
  let fixture: ComponentFixture<AskVersionSaveModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AskVersionSaveModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AskVersionSaveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
