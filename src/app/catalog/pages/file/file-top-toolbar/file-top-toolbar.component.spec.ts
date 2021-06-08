import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileTopToolbarComponent } from './file-top-toolbar.component';

describe('FileTopToolbarComponent', () => {
  let component: FileTopToolbarComponent;
  let fixture: ComponentFixture<FileTopToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileTopToolbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileTopToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
