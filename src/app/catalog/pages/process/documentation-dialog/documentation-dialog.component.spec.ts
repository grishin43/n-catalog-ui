import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentationDialogComponent } from './documentation-dialog.component';

describe('DocumentationDialogComponent', () => {
  let component: DocumentationDialogComponent;
  let fixture: ComponentFixture<DocumentationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
