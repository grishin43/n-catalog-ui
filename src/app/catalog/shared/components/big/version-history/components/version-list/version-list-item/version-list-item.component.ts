import {Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ProcessVersionModel} from '../../../../../../../../models/domain/process-version.model';
import {HistoryTypeEnum} from '../../../models/history-type.enum';
import {AnimationsHelper} from '../../../../../../../helpers/animations.helper';
import {VersionDetailsModalComponent} from '../../version-details-modal/version-details-modal.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'np-version-list-item',
  templateUrl: './version-list-item.component.html',
  styleUrls: ['./version-list-item.component.scss'],
  animations: [AnimationsHelper.fadeInOut]
})
export class VersionListItemComponent implements OnInit {
  @Input() type: HistoryTypeEnum;
  @Input() version: ProcessVersionModel;
  @Input() active: boolean;
  @Input() autosaving: boolean;
  @Input() isLocked: boolean;

  @Output() versionOpened = new EventEmitter<ProcessVersionModel>();
  @Output() versionLaunched = new EventEmitter<ProcessVersionModel>();
  @Output() versionCreated = new EventEmitter<ProcessVersionModel>();

  public readonly dateFormat: string = 'dd MMMM yyyy, HH:mm:ss';
  public showMenu: boolean;
  public eHistoryType = HistoryTypeEnum;
  public focused: boolean;

  @ViewChild('itemRef') itemRef;

  @HostListener('document:click', ['$event'])
  public onOutsideClick(event: MouseEvent): void {
    this.focused = this.itemRef.nativeElement.contains(event.target);
  }

  constructor(
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
  }

  public openVersion(): void {
    this.versionOpened.emit(this.version);
  }

  public launchVersion(): void {
    this.versionLaunched.emit(this.version);
  }

  public showDetails(): void {
    this.dialog.open(VersionDetailsModalComponent, {
      width: '700px',
      autoFocus: false,
      data: this.version
    });
  }

  public get isOnline(): boolean {
    return window.navigator.onLine;
  }

}
