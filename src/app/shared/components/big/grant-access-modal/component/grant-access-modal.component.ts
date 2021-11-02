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
import {ProcessModel} from '../../../../../models/domain/process.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormFieldEnum} from '../../../../../models/form-field.enum';
import {CatalogEntityPermissionEnum} from '../../../../../catalog/models/catalog-entity-permission.enum';
import {TranslateService} from '@ngx-translate/core';
import {forkJoin, Observable, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter} from 'rxjs/operators';
import {ApiService} from '../../../../../catalog/services/api/api.service';
import {SearchModel} from '../../../../../models/domain/search.model';
import {UserModel} from '../../../../../models/domain/user.model';
import {ToastService} from '../../../small/toast/service/toast.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {ProcessWorkgroupModel} from '../../../../../models/domain/process-workgroup.model';
import {PermissionLevel} from '../../../../../models/domain/permission-level.enum';
import {Clipboard} from '@angular/cdk/clipboard';
import {HttpErrorResponse} from '@angular/common/http';

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
  public permissions = [
    CatalogEntityPermissionEnum.VIEWER,
    CatalogEntityPermissionEnum.EDITOR
  ];
  public users: UserModel[];
  public selectedUsers: UserModel[] = [];
  public separatorKeysCodes = [ENTER, COMMA];
  public workgroup: ProcessWorkgroupModel[];
  public workgroupLoader: boolean;

  private subs = new Subscription();

  @HostListener('window:keydown', ['$event']) onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.formSubmit();
    }
  }

  constructor(
    private dialogRef: MatDialogRef<GrantAccessModalComponent>,
    @Inject(MAT_DIALOG_DATA) public process: ProcessModel,
    private translate: TranslateService,
    private api: ApiService,
    private toast: ToastService,
    private cdRef: ChangeDetectorRef,
    private clipboard: Clipboard
  ) {
  }

  @ViewChild('usersInput') usersInput: ElementRef;

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

  private subscribeProcessWorkgroup(): void {
    this.workgroupLoader = true;
    this.subs.add(
      this.api.getProcessWorkGroup(this.process.parent.id, this.process.id)
        .subscribe((res: SearchModel<ProcessWorkgroupModel>) => {
          this.workgroupLoader = false;
          this.workgroup = res?.items;
        }, () => {
          this.workgroupLoader = false;
        })
    );
  }

  private initForm(): void {
    const defaultPermission = this.translate.instant('common.' + CatalogEntityPermissionEnum.VIEWER);
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
            if (!this.checkUsername(str)) {
              this.searchUsers(str);
            }
          })
      );
    }
  }

  private checkUsername(str: string): boolean {
    return !!this.users?.find((u: UserModel) => u.username === str);
  }

  public get filteredUsers(): UserModel[] {
    const usernames = new Set(this.selectedUsers?.map((u: UserModel) => u.username));
    return this.users?.filter((u: UserModel) => !usernames.has(u.username));
  }

  private searchUsers(searchTerm: string): void {
    this.searchLoader = true;
    this.subs.add(
      this.api.searchUsers(searchTerm)
        .subscribe((res: SearchModel<UserModel>) => {
          this.searchLoader = false;
          this.users = res?.items;
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
          this.selectedUsers.map((u: UserModel) => {
            return this.api.grantAccessToProcess(
              this.process.parent.id, this.process.id, this.form.value[FormFieldEnum.PERMISSIONS], u.username
            );
          })
        ).subscribe(() => {
          this.formLoader = false;
          this.closeModal();
        }, (err: HttpErrorResponse) => {
          this.formLoader = false;
          this.toast.showError(
            'errors.errorOccurred',
            err.error?.message || err.message
          );
        })
      );
    }
  }

  public userSelected(event: MatAutocompleteSelectedEvent): void {
    const user = this.users.find((u: UserModel) => event.option.value === u.username);
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

  public get ownerPermissionId(): string {
    return this.workgroup?.find((wg: ProcessWorkgroupModel) => wg.level.code === PermissionLevel.OWNER)?.id;
  }

  public get currentUrl(): string {
    return window.location.href;
  }

  public copyToClipboard(event: MouseEvent): void {
    (event.currentTarget as HTMLElement).blur();
    this.clipboard.copy(this.currentUrl);
    this.toast.show('common.copied', 1500);
  }

}
