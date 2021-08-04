import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEntityButtonComponent } from './create-entity-button.component';

describe('CreateEntityButtonComponent', () => {
  let component: CreateEntityButtonComponent;
  let fixture: ComponentFixture<CreateEntityButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEntityButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEntityButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
