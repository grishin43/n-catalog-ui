import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderActionsButtonComponent } from './folder-actions-button.component';

describe('CreateEntityButtonComponent', () => {
  let component: FolderActionsButtonComponent;
  let fixture: ComponentFixture<FolderActionsButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FolderActionsButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderActionsButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
