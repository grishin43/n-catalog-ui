import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderBreadcrumbsComponent } from './folder-breadcrumbs.component';

describe('FolderBreadcrumbsComponent', () => {
  let component: FolderBreadcrumbsComponent;
  let fixture: ComponentFixture<FolderBreadcrumbsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FolderBreadcrumbsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderBreadcrumbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
