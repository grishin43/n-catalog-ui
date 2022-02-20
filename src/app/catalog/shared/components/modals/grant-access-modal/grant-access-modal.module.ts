import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GrantAccessModalComponent} from './component/grant-access-modal.component';
import {MatDialogModule} from '@angular/material/dialog';
import {TranslateModule} from '@ngx-translate/core';
import {MatButtonModule} from '@angular/material/button';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatIconModule} from '@angular/material/icon';
import {NpButtonModule} from '../../general/np-button/np-button.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatChipsModule} from '@angular/material/chips';
import {NpAvatarModule} from '../../general/np-avatar/np-avatar.module';
import {AcronymModule} from '../../../pipes/acronym/acronym.module';
import {WorkgroupUserComponent} from './component/workgroup-user/workgroup-user.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatDividerModule} from '@angular/material/divider';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {UserInfoTooltipModule} from '../../../directives/user-info-tooltip/user-info-tooltip.module';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@NgModule({
  declarations: [
    GrantAccessModalComponent,
    WorkgroupUserComponent
  ],
  exports: [
    GrantAccessModalComponent
  ],
    imports: [
        CommonModule,
        MatDialogModule,
        TranslateModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        MatIconModule,
        NpButtonModule,
        MatProgressSpinnerModule,
        MatChipsModule,
        NpAvatarModule,
        AcronymModule,
        MatMenuModule,
        MatDividerModule,
        MatTooltipModule,
        ClipboardModule,
        UserInfoTooltipModule,
        MatSlideToggleModule
    ]
})
export class GrantAccessModalModule {
}
