import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CantDeleteFolderModalComponent } from './cant-delete-folder-modal.component';

describe('CantDeleteFolderModalComponent', () => {
  let component: CantDeleteFolderModalComponent;
  let fixture: ComponentFixture<CantDeleteFolderModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CantDeleteFolderModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CantDeleteFolderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
