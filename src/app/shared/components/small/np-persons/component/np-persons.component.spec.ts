import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NpPersonsComponent } from './np-persons.component';

describe('NpPersonsComponent', () => {
  let component: NpPersonsComponent;
  let fixture: ComponentFixture<NpPersonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NpPersonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NpPersonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
