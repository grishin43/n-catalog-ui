import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef, HostListener,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CurrentProcessModel} from '../../../../../models/current-process.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormFieldEnum} from '../../../../../../models/form-field.enum';
import {EntityPermissionLevelEnum} from '../../../../../models/entity-permission-level.enum';
import {TranslateService} from '@ngx-translate/core';
import {forkJoin, Observable, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter} from 'rxjs/operators';
import {ApiService} from '../../../../../services/api/api.service';
import {SearchModel} from '../../../../../../models/domain/search.model';
import {UserModel, WorkgroupUserModel} from '../../../../../../models/domain/user.model';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {ProcessWorkgroupModel, ProcessWorkgroupPermissionModel} from '../../../../../../models/domain/process-workgroup.model';
import {Clipboard} from '@angular/cdk/clipboard';
import {HttpErrorResponse} from '@angular/common/http';
import {ToastService} from '../../../../../../toast/service/toast.service';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';

@Component({
  selector: 'np-grant-access-modal',
  templateUrl: './grant-access-modal.component.html',
  styleUrls: ['./grant-access-modal.component.scss']
})
export class GrantAccessModalComponent implements OnInit, AfterViewChecked, OnDestroy {
  public form: FormGroup;
  public formControlName = FormFieldEnum;
  public formLoader: boolean;
  public searchLoader: boolean;
  public permissions: EntityPermissionLevelEnum[] = [
    EntityPermissionLevelEnum.VIEWER,
    EntityPermissionLevelEnum.EDITOR
  ];
  public workgroupUsers: UserModel[];
  public selectedUsers: UserModel[] = [];
  public separatorKeysCodes = [ENTER, COMMA];
  public workgroup: ProcessWorkgroupModel[];
  public workgroupPermissions: EntityPermissionLevelEnum[] = [
    EntityPermissionLevelEnum.VIEWER,
    EntityPermissionLevelEnum.EDITOR,
    EntityPermissionLevelEnum.OWNER
  ];
  public workgroupLoader: boolean;
  public globalViewerPermission: ProcessWorkgroupPermissionModel;
  public hasViewerGlobalPermission: boolean;
  public toggleLoader: boolean;
  public searchVirtualScrollHeight: string;
  public selectedPermission: EntityPermissionLevelEnum = this.permissions[0];

  private subs = new Subscription();

  @ViewChild('usersInput') usersInput: ElementRef;

  @HostListener('window:keydown', ['$event']) onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.formSubmit();
    }
  }

  constructor(
    private dialogRef: MatDialogRef<GrantAccessModalComponent>,
    @Inject(MAT_DIALOG_DATA) public process: CurrentProcessModel,
    private translate: TranslateService,
    private api: ApiService,
    private toast: ToastService,
    private cdRef: ChangeDetectorRef,
    private clipboard: Clipboard
  ) {
  }

  ngOnInit(): void {
    this.initForm();
    this.subscribeProcessWorkgroup();
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  public get ownerPermissionId(): string {
    return this.workgroup?.find((wg: ProcessWorkgroupModel) => wg.level.code === EntityPermissionLevelEnum.OWNER)?.id;
  }

  public get currentUrl(): string {
    return window.location.href;
  }

  private subscribeProcessWorkgroup(): void {
    this.workgroupLoader = true;
    this.subs.add(
      this.api.getProcessWorkGroup(this.process.parent.id, this.process.id)
        .subscribe((res: SearchModel<ProcessWorkgroupModel>) => {
          this.workgroup = res?.items;
          this.checkGlobalPermission(res?.items);
          this.workgroupLoader = false;
        }, () => {
          this.workgroupLoader = false;
        })
    );
  }

  private checkGlobalPermission(items: ProcessWorkgroupModel[]): void {
    this.globalViewerPermission = items?.find((pw: ProcessWorkgroupModel) => pw.user == null);
    this.hasViewerGlobalPermission = !!this.globalViewerPermission;
  }

  private initForm(): void {
    const defaultPermission = this.translate.instant('common.' + this.permissions[0]);
    this.form = new FormGroup({
      [FormFieldEnum.SEARCH]: new FormControl(undefined, [Validators.required]),
      [FormFieldEnum.PERMISSIONS]: new FormControl(defaultPermission, [Validators.required])
    });
    this.subscribeSearchInput();
  }

  private subscribeSearchInput(): void {
    const control = this.form.get([FormFieldEnum.SEARCH]);
    if (control) {
      this.subs.add(
        control.valueChanges
          .pipe(
            filter(str => str?.trim().length),
            debounceTime(300),
            distinctUntilChanged()
          )
          .subscribe((str: string) => {
            if (str?.trim()?.length >= 3) {
              this.searchUsers(str);
            }
          })
      );
    }
  }

  private searchUsers(searchTerm: string): void {
    this.searchLoader = true;
    this.subs.add(
      this.api.searchUsers(searchTerm, this.process.companyID)
        .subscribe((res: UserModel[]) => {
          this.workgroupUsers = res;
          if (res.length < 4) {
            this.searchVirtualScrollHeight = (res.length * 56) + 'px';
          } else {
            this.searchVirtualScrollHeight = '224px';
          }
          this.searchLoader = false;
        }, () => {
          this.searchLoader = false;
          this.toast.showError(
            'errors.errorOccurred',
            this.translate.instant('errors.searchUsersFailed')
          );
        })
    );
  }

  public closeModal(): void {
    this.dialogRef.close();
  }

  public formSubmit(): void {
    if (this.selectedUsers.length) {
      this.formLoader = true;
      this.subs.add(
        forkJoin(
          this.selectedUsers.map((wu: UserModel) => {
            return this.api.grantAccessToProcess(this.process.parent.id, this.process.id, this.selectedPermission, wu);
          })
        ).subscribe(() => {
          this.formLoader = false;
          this.closeModal();
          this.toast.showMessage('common.accessSuccessfullyGranted');
        }, () => {
          this.formLoader = false;
        })
      );
    }
  }

  public userSelected(event: MatAutocompleteSelectedEvent): void {
    const user = this.workgroupUsers.find((u: UserModel) => event.option.value === u.id);
    this.selectedUsers.push(user);
    this.usersInput.nativeElement.value = '';
    this.form.get([FormFieldEnum.SEARCH]).patchValue(null);
  }

  public usernameRemove(user: UserModel): void {
    const index = this.selectedUsers.indexOf(user);
    if (index >= 0) {
      this.selectedUsers.splice(index, 1);
    }
  }

  public copyToClipboard(event: MouseEvent): void {
    (event.currentTarget as HTMLElement).blur();
    this.clipboard.copy(this.currentUrl);
    this.toast.show('common.copied', 1500);
  }

  public onToggleChange(event: MatSlideToggleChange): void {
    if (event.checked) {
      this.sendGlobalAccessRequest(
        this.api.grantGlobalAccessToProcess(this.process.parent.id, this.process.id),
        event.checked,
        'common.globalAccessSuccessfullyGranted'
      );
    } else {
      this.sendGlobalAccessRequest(
        this.api.revokeGlobalAccessToProcess(this.process.parent.id, this.process.id, this.globalViewerPermission.id),
        event.checked,
        'common.globalAccessSuccessfullyRevoked'
      );
    }
  }

  private sendGlobalAccessRequest(request: Observable<any>, flag: boolean, toastMessage: string): void {
    this.toggleLoader = true;
    this.subs.add(
      request.subscribe(() => {
        this.hasViewerGlobalPermission = flag;
        this.toggleLoader = false;
        this.toast.showMessage(toastMessage);
      }, () => {
        this.toggleLoader = false;
      })
    );
  }

  public onPermissionSelected(permission: string): void {
    this.selectedPermission = permission as EntityPermissionLevelEnum;
  }

}
