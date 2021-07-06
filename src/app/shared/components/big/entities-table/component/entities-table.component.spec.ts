import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntitiesTableComponent } from './entities-table.component';

describe('NpTableComponent', () => {
  let component: EntitiesTableComponent;
  let fixture: ComponentFixture<EntitiesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntitiesTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntitiesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
