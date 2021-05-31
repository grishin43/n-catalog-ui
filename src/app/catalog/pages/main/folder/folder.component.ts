import {Component, Input, OnInit} from '@angular/core';
import {CatalogFolderModel} from '../../../models/folder.model';

@Component({
  selector: 'np-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent implements OnInit {
  @Input() folder: CatalogFolderModel;

  constructor() {
  }

  ngOnInit(): void {
  }

}
