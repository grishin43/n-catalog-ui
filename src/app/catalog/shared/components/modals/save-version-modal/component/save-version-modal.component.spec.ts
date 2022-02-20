import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveVersionModalComponent } from './save-version-modal.component';

describe('SaveVersionModalComponent', () => {
  let component: SaveVersionModalComponent;
  let fixture: ComponentFixture<SaveVersionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveVersionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveVersionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
