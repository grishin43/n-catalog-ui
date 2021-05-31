import {Component, OnInit} from '@angular/core';
import {CatalogFolderModel} from '../../models/folder.model';
import {ContentHelper} from '../../helpers/content.helper';

@Component({
  selector: 'np-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  public mainFolders: CatalogFolderModel[] = ContentHelper.catalogMainFolders;

  constructor() {
  }

  ngOnInit(): void {
  }

}
