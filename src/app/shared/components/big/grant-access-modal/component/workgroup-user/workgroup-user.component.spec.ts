import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkgroupUserComponent } from './workgroup-user.component';

describe('WorkgroupUserComponent', () => {
  let component: WorkgroupUserComponent;
  let fixture: ComponentFixture<WorkgroupUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkgroupUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkgroupUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
