import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NpTableComponent } from './np-table.component';

describe('NpTableComponent', () => {
  let component: NpTableComponent;
  let fixture: ComponentFixture<NpTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NpTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NpTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
