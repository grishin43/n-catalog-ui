import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NpAvatarComponent } from './np-avatar.component';

describe('NpAvatarComponent', () => {
  let component: NpAvatarComponent;
  let fixture: ComponentFixture<NpAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NpAvatarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NpAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
