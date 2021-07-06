import {Component, OnInit} from '@angular/core';
import {EntitiesTabService} from './services/entities-tab/entities-tab.service';

@Component({
  selector: 'np-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

  constructor(
    private entitiesTabService: EntitiesTabService
  ) {
  }

  ngOnInit(): void {
    this.entitiesTabService.init();
  }

}
