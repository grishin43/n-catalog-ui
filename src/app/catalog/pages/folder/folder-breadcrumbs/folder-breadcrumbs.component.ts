import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'np-folder-breadcrumbs',
  templateUrl: './folder-breadcrumbs.component.html',
  styleUrls: ['./folder-breadcrumbs.component.scss']
})
export class FolderBreadcrumbsComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

  public onCreateFolderClicked(event: MouseEvent): void {
    // TODO
  }

  public onCreateFileClicked(event: MouseEvent): void {
    // TODO
  }

}
