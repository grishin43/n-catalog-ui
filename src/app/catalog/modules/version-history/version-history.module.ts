import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {VersionHistoryComponent} from './components/version-history.component';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {TranslateModule} from '@ngx-translate/core';
import { VersionListComponent } from './components/version-list/version-list.component';
import {MatMenuModule} from '@angular/material/menu';
import { VersionListItemComponent } from './components/version-list/version-list-item/version-list-item.component';
import {NpAvatarModule} from '../../../shared/components/small/np-avatar/np-avatar.module';
import {AcronymModule} from '../../../shared/pipes/acronym/acronym.module';
import {UserInfoTooltipModule} from '../../../shared/directives/user-info-tooltip/user-info-tooltip.module';
import { VersionDetailsModalComponent } from './components/version-details-modal/version-details-modal.component';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
  declarations: [
    VersionHistoryComponent,
    VersionListComponent,
    VersionListItemComponent,
    VersionDetailsModalComponent
  ],
  exports: [
    VersionHistoryComponent
  ],
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        TranslateModule,
        MatMenuModule,
        NpAvatarModule,
        AcronymModule,
        UserInfoTooltipModule,
        MatDialogModule
    ]
})
export class VersionHistoryModule {
}