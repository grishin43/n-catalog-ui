import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionListComponent } from './version-list.component';

describe('CommitListComponent', () => {
  let component: VersionListComponent;
  let fixture: ComponentFixture<VersionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VersionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VersionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
