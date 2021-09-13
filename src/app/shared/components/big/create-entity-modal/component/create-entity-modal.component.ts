import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormFieldEnum} from '../../../../../models/form-field.enum';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ApiService} from '../../../../../catalog/services/api/api.service';
import {CatalogEntityEnum} from '../../../../../catalog/models/catalog-entity.enum';
import {MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {Router} from '@angular/router';
import {AppRouteEnum} from '../../../../../models/app-route.enum';
import {CatalogRouteEnum} from '../../../../../catalog/models/catalog-route.enum';
import {ModalInjectableDataModel} from '../../../../../models/modal-injectable-data.model';
import {Subscription} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {SearchModel} from '../../../../../models/domain/search.model';
import {FolderFieldKey, FolderModel} from '../../../../../models/domain/folder.model';
import {ProcessTypeModel} from '../../../../../models/domain/process-type.model';
import {ProcessModel} from '../../../../../models/domain/process.model';
import {EntityPathModel} from '../../../../../models/domain/entity-path.model';
import {ToastService} from '../../../small/toast/service/toast.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'np-create-entity-modal',
  templateUrl: './create-entity-modal.component.html',
  styleUrls: ['./create-entity-modal.component.scss']
})
export class CreateEntityModalComponent implements OnInit, OnDestroy {
  readonly duplicatorErrorKey = 'duplicatedName';
  public form: FormGroup;
  public formControlName = FormFieldEnum;
  public formLoader: boolean;
  public processTypesLoader: boolean;
  public explorerLoader: boolean;
  public newFolderLoader: boolean;
  public rootFolders: FolderModel[] = [];
  public openedFolder: FolderModel;
  public eCatalogEntity = CatalogEntityEnum;
  public processTypes: ProcessTypeModel[];
  public newFolderMode: boolean;

  private subscription = new Subscription();

  constructor(
    private dialogRef: MatDialogRef<CreateEntityModalComponent>,
    private api: ApiService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: ModalInjectableDataModel,
    private translateService: TranslateService,
    private toast: ToastService
  ) {
  }

  ngOnInit(): void {
    this.getRootFolders();
    if (this.data && this.data.parent) {
      this.openedFolder = this.data.parent;
      this.patchOpenedFolder(this.openedFolder.id);
      this.initForm(this.folderPath);
    } else {
      this.initForm();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private getProcessTypes(): void {
    this.processTypesLoader = true;
    this.subscription.add(
      this.api.getProcessTypes()
        .subscribe((res: SearchModel<ProcessTypeModel>) => {
          if (res) {
            this.processTypesLoader = false;
            this.processTypes = res.items;
          } else {
            this.processTypesLoader = false;
            this.processTypes = undefined;
          }
        }, (err: HttpErrorResponse) => {
          this.processTypesLoader = false;
          this.showToast(err.error?.message || err.message);
        })
    );
  }

  private getRootFolders(): void {
    this.explorerLoader = true;
    this.subscription.add(
      this.api.getRootFoldersWithSubs()
        .subscribe((res: SearchModel<FolderModel>) => {
          this.explorerLoader = false;
          this.rootFolders = res?.items;
        }, (err: HttpErrorResponse) => {
          this.explorerLoader = false;
          this.showToast(err.error?.message || err.message);
        })
    );
  }

  private initForm(parentFolderName?: string): void {
    this.form = new FormGroup({
      [FormFieldEnum.ENTITY_NAME]: new FormControl(undefined, [Validators.required]),
      [FormFieldEnum.FOLDER_PATH]: new FormControl(parentFolderName, [Validators.required])
    });
    if (this.isProcess) {
      this.form.addControl(FormFieldEnum.PROCESS_TYPE, new FormControl(undefined, [Validators.required]));
      this.getProcessTypes();
    }
  }

  private removeControlError(controlName: string, errorKey: string): void {
    const control = this.form.get(controlName);
    if (control.hasError(errorKey)) {
      delete control.errors[errorKey];
      control.updateValueAndValidity();
    }
  }

  public closeModal(): void {
    this.dialogRef.close();
  }

  public onFolderClick(event: MouseEvent, folder: FolderModel): void {
    event.preventDefault();
    event.stopPropagation();
    this.patchOpenedFolder(folder.id);
  }

  public onFolderBack(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.openedFolder) {
      if (this.openedFolder.parent) {
        this.patchOpenedFolder(this.openedFolder.parent.id);
      } else {
        this.openedFolder = undefined;
      }
    }
    this.removeControlError(FormFieldEnum.ENTITY_NAME, this.duplicatorErrorKey);
  }

  private patchOpenedFolder(id: string): void {
    this.explorerLoader = true;
    this.subscription.add(
      this.api.getFolderByIdWithSubs(id)
        .subscribe((res: FolderModel) => {
          this.explorerLoader = false;
          this.openedFolder = res;
        }, (err: HttpErrorResponse) => {
          this.explorerLoader = false;
          this.showToast(err.error?.message || err.message);
        })
    );
  }

  public selectFolder(event: MouseEvent, matAutocompleteTrigger: MatAutocompleteTrigger): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.openedFolder) {
      this.form.get(FormFieldEnum.FOLDER_PATH).patchValue(this.folderPath);
      matAutocompleteTrigger.closePanel();
      this.handleEntityNameDuplicator(FormFieldEnum.ENTITY_NAME);
    }
  }

  public get folderPath(): string {
    if (this.openedFolder) {
      return this.extractFolderPathname(this.openedFolder);
    }
    return this.translateService.instant('common.rootFolders');
  }

  public extractFolderPathname(folder: FolderModel): string {
    if (folder.path) {
      const path = folder.path.map((item: EntityPathModel) => item.name).join('/');
      return path?.length ? `${path}/${folder.name}` : folder.name;
    }
    return folder.name;
  }

  public formSubmit(): void {
    this.handleEntityNameDuplicator(FormFieldEnum.ENTITY_NAME);
    if (this.form.valid) {
      this.handleFormSubmit();
    }
  }

  private handleFormSubmit(): void {
    if (this.isFolder) {
      this.createGeneralFolder();
    } else if (this.isProcess) {
      this.createProcess();
    }
  }

  private get currentFolderId(): string {
    return this.openedFolder?.id || this.data.parent?.id;
  }

  private createProcess(): void {
    this.formLoader = true;
    const processType = this.processTypes.find(ft => this.form.value[FormFieldEnum.PROCESS_TYPE] === ft.name);
    const processName = this.form.value[FormFieldEnum.ENTITY_NAME];
    this.subscription.add(
      this.api.createProcess(this.currentFolderId, processType.code, processName)
        .subscribe(
          () => {
            this.formLoader = false;
            this.showToast('common.processCreated');
            this.closeModal();
            if (typeof this.data.ssCb === 'function') {
              this.data.ssCb();
            }
          },
          (err: HttpErrorResponse) => {
            this.formLoader = false;
            this.showToast(err.error?.message || err.message);
          })
    );
  }

  private createGeneralFolder(): void {
    this.formLoader = true;
    const parentFolderId = this.openedFolder?.id || this.data?.parent?.id;
    this.subscription.add(
      this.api.createFolder(parentFolderId, this.form.value[FormFieldEnum.ENTITY_NAME])
        .subscribe(
          () => {
            this.formLoader = false;
            this.showToast('common.folderCreated');
            this.closeModal();
            // TODO
            setTimeout(() => {
              this.router.navigate([`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.FOLDER}/${parentFolderId}`]);
            }, 2000);
            if (typeof this.data.ssCb === 'function') {
              this.data.ssCb();
            }
          },
          (err: HttpErrorResponse) => {
            this.formLoader = false;
            this.showToast(err.error?.message || err.message);
          })
    );
  }

  private showToast(i18nKey: string): void {
    this.toast.show(i18nKey, 1500, undefined, 'bottom', 'right');
  }

  public processTypeSelected(event: MouseEvent, option: ProcessTypeModel): void {
    event.preventDefault();
    event.stopPropagation();
    this.form.get(FormFieldEnum.PROCESS_TYPE).patchValue(option.name);
  }

  public onAddNewFolder(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.newFolderMode = true;
    this.form.addControl(FormFieldEnum.NEW_ENTITY_NAME, new FormControl(null, [Validators.required]));
  }

  public onNewFolderBack(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.closeNewFolderMode();
  }

  private closeNewFolderMode(): void {
    this.newFolderMode = false;
    this.form.removeControl(FormFieldEnum.NEW_ENTITY_NAME);
  }

  public onCreateNewFolder(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const control = this.form.get(FormFieldEnum.NEW_ENTITY_NAME);
    if (control.valid) {
      this.createFolder(this.currentFolderId, control.value);
    }
  }

  private createFolder(parentFolderId: string, folderName: string): void {
    this.newFolderLoader = true;
    this.subscription.add(
      this.api.createFolder(parentFolderId, folderName)
        .subscribe(() => {
          this.newFolderLoader = false;
          this.showToast('common.folderCreated');
          this.closeNewFolderMode();
          // TODO
          setTimeout(() => {
            this.patchOpenedFolder(this.openedFolder.id);
          }, 2000);
        }, () => {
          this.newFolderLoader = false;
        })
    );
  }

  public handleEntityNameDuplicator(controlName: string): void {
    const control = this.form.get(controlName);
    const entityKey = this.isFolder || this.newFolderMode
      ? FolderFieldKey.FOLDERS
      : FolderFieldKey.PROCESSES;
    if (control.value?.length) {
      let duplicatorMatched;
      if (this.openedFolder) {
        duplicatorMatched = this.matchNameDuplicates(this.openedFolder[entityKey]?.items, control.value);
      } else if (this.rootFolders && this.isFolder) {
        duplicatorMatched = this.matchNameDuplicates(this.rootFolders, control.value);
      }
      if (duplicatorMatched) {
        control.setErrors({[this.duplicatorErrorKey]: {value: control.value}});
        control.markAsTouched();
      } else {
        this.removeControlError(controlName, this.duplicatorErrorKey);
      }
    } else {
      this.removeControlError(controlName, this.duplicatorErrorKey);
    }
  }

  private matchNameDuplicates(arr: any, str: string): FolderModel | ProcessModel {
    if (arr) {
      return arr.find((entity: any): boolean => {
        return entity.name.trim().toLowerCase() === str.trim().toLowerCase();
      });
    }
    return undefined;
  }

  public get isProcess(): boolean {
    return this.data.type === CatalogEntityEnum.PROCESS;
  }

  public get isFolder(): boolean {
    return this.data.type === CatalogEntityEnum.FOLDER;
  }

  public get openedFolderHasChildren(): boolean {
    return !!this.openedFolderSubFolders?.length || !!this.openedFolderProcesses?.length;
  }

  public get openedFolderHasSubFolders(): boolean {
    return !!this.openedFolderSubFolders?.length;
  }

  public get openedFolderSubFolders(): FolderModel[] {
    return this.openedFolder?.[FolderFieldKey.FOLDERS]?.items;
  }

  public get openedFolderProcesses(): ProcessModel[] {
    return this.openedFolder?.[FolderFieldKey.PROCESSES]?.items;
  }

}
