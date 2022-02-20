import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsOverflowedModalComponent } from './tabs-overflowed-modal.component';

describe('TabsOverflowedModalComponent', () => {
  let component: TabsOverflowedModalComponent;
  let fixture: ComponentFixture<TabsOverflowedModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabsOverflowedModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsOverflowedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
