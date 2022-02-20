import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionListItemComponent } from './version-list-item.component';

describe('CommitListItemComponent', () => {
  let component: VersionListItemComponent;
  let fixture: ComponentFixture<VersionListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VersionListItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VersionListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
