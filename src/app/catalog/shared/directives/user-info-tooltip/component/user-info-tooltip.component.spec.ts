import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserInfoTooltipComponent } from './user-info-tooltip.component';

describe('HtmlTooltipComponent', () => {
  let component: UserInfoTooltipComponent;
  let fixture: ComponentFixture<UserInfoTooltipComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserInfoTooltipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInfoTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
