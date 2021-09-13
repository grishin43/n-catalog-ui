import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XmlEditorComponent } from './xml-editor.component';

describe('XmlEditorComponent', () => {
  let component: XmlEditorComponent;
  let fixture: ComponentFixture<XmlEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XmlEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XmlEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
