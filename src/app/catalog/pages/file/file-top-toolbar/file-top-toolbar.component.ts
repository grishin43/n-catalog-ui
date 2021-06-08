import {Component, OnInit} from '@angular/core';
import {ToolbarItemModel} from '../../../models/toolbar/toolbar-item.model';
import {FileToolbarHelper} from '../../../helpers/file-toolbar.helper';

@Component({
  selector: 'np-file-top-toolbar',
  templateUrl: './file-top-toolbar.component.html',
  styleUrls: ['./file-top-toolbar.component.scss']
})
export class FileTopToolbarComponent implements OnInit {
  public tools: ToolbarItemModel[];

  constructor() {
  }

  ngOnInit(): void {
    this.tools = FileToolbarHelper.topToolbar;
  }

}
