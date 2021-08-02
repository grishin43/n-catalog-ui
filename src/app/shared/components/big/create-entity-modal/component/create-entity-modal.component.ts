import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormFieldEnum} from '../../../../../models/form-field.enum';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CatalogEntityModel} from '../../../../../catalog/models/catalog-entity.model';
import {ApiService} from '../../../../../catalog/services/api/api.service';
import {CatalogEntityEnum} from '../../../../../catalog/models/catalog-entity.enum';
import {MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {Router} from '@angular/router';
import {AppRouteEnum} from '../../../../../models/app-route.enum';
import {CatalogRouteEnum} from '../../../../../catalog/models/catalog-route.enum';
import {InjectableDataModel} from '../models/injectable-data.model';
import {v4 as uuidv4} from 'uuid';
import {Subscription} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {HttpErrorResponse} from '@angular/common/http';
import {SearchModel} from '../../../../../models/domain/search.model';
import {FolderModel} from '../../../../../models/domain/folder.model';
import {MapHelper} from '../../../../../catalog/helpers/map.helper';
import {ProcessTypeModel} from '../../../../../models/domain/process-type.model';

@Component({
  selector: 'np-create-entity-modal',
  templateUrl: './create-entity-modal.component.html',
  styleUrls: ['./create-entity-modal.component.scss']
})
export class CreateEntityModalComponent implements OnInit, OnDestroy {
  readonly duplicatorErrorKey = 'duplicatedName';
  public form: FormGroup;
  public formControlName = FormFieldEnum;
  public loader: boolean;
  public fileTypesLoader: boolean;
  public rootFoldersLoader: boolean;
  public rootFolders: CatalogEntityModel[] = [];
  public openedFolder: CatalogEntityModel;
  public selectedFolder: CatalogEntityModel;
  public selectedFolderPaths: string[] = [];
  public isSingleClick = true;
  public eCatalogEntity = CatalogEntityEnum;
  public fileTypes: ProcessTypeModel[];
  public newFolderMode: boolean;

  private subscription = new Subscription();

  constructor(
    private dialogRef: MatDialogRef<CreateEntityModalComponent>,
    private api: ApiService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: InjectableDataModel,
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.getRootFolders();
    if (this.data && this.data.parent) {
      this.initForm(this.data.parent.name);
    } else {
      this.initForm();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private getProcessTypes(): void {
    this.fileTypesLoader = true;
    this.subscription.add(
      this.api.getProcessTypes()
        .subscribe((res: SearchModel<ProcessTypeModel>) => {
          if (res) {
            this.fileTypesLoader = false;
            this.fileTypes = res.items;
          } else {
            this.fileTypesLoader = false;
            this.fileTypes = undefined;
          }
        }, (err: HttpErrorResponse) => {
          this.fileTypesLoader = false;
          this.showToast(err.message);
        })
    );
  }

  private getRootFolders(): void {
    this.rootFoldersLoader = true;
    this.subscription.add(
      this.api.getRootFolders()
        .subscribe((res: SearchModel<FolderModel>) => {
          this.rootFoldersLoader = false;
          if (res) {
            this.rootFolders = MapHelper.mapFoldersToEntities(res.items);
          } else {
            this.rootFolders = undefined;
          }
        }, (err: HttpErrorResponse) => {
          this.rootFoldersLoader = false;
          this.showToast(err.message);
        })
    );
  }

  private initForm(parentFolderName?: string): void {
    this.form = new FormGroup({
      [FormFieldEnum.ENTITY_NAME]: new FormControl(undefined, [Validators.required]),
      [FormFieldEnum.FOLDER_PATH]: new FormControl(parentFolderName)
    });
    if (this.data.type === CatalogEntityEnum.FILE) {
      this.form.addControl(FormFieldEnum.FILE_TYPE, new FormControl(undefined, [Validators.required]));
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

  public optionSingleClick(event: MouseEvent, entity: CatalogEntityModel): void {
    event.preventDefault();
    event.stopPropagation();
    if (entity.type === CatalogEntityEnum.FOLDER) {
      this.isSingleClick = true;
      setTimeout(() => {
        if (this.isSingleClick) {
          this.selectedFolder = entity;
        }
      }, 200);
    }
  }

  public optionDoubleClick(event: MouseEvent, entity: CatalogEntityModel): void {
    event.preventDefault();
    event.stopPropagation();
    if (entity.type === CatalogEntityEnum.FOLDER && entity.entities?.length) {
      this.isSingleClick = false;
      this.selectedFolderPaths.push(entity.name);
      this.openedFolder = entity;
      this.selectedFolder = undefined;
      this.handleEntityNameDuplicator(FormFieldEnum.ENTITY_NAME, this.data.type);
    }
  }

  public onFolderBack(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.selectedFolderPaths.splice(this.selectedFolderPaths.length - 1, 1);
    if (this.openedFolder) {
      this.openedFolder = this.findEntityParent(this.openedFolder.id, this.rootFolders);
      this.removeControlError(FormFieldEnum.ENTITY_NAME, this.duplicatorErrorKey);
    }
  }

  private findEntityParent(id: string, arr: CatalogEntityModel[], parent?: CatalogEntityModel): CatalogEntityModel {
    return arr.reduce((a: CatalogEntityModel, item: CatalogEntityModel) => {
      if (a) {
        return a;
      }
      if (item.id === id) {
        return parent;
      }
      if (item.entities) {
        return this.findEntityParent(id, item.entities, item);
      }
    }, null);
  }

  public onFolderSelected(event: MouseEvent, matAutocompleteTrigger: MatAutocompleteTrigger): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.selectedFolder) {
      let value;
      if (this.selectedFolderPaths?.length) {
        value = this.fullFolderPath;
      } else {
        value = this.selectedFolder.name;
      }
      this.form.get(FormFieldEnum.FOLDER_PATH).patchValue(value);
      matAutocompleteTrigger.closePanel();
      this.handleEntityNameDuplicator(FormFieldEnum.ENTITY_NAME, this.data.type);
    }
  }

  public get fullFolderPath(): string {
    if (this.selectedFolderPaths.length) {
      if (this.selectedFolder) {
        const value = [].concat(this.selectedFolderPaths);
        value.push(this.selectedFolder.name);
        return value.join('/');
      } else if (this.openedFolder) {
        return this.selectedFolderPaths.join('/');
      }
    } else if (this.selectedFolder) {
      return this.selectedFolder.name;
    }
    return undefined;
  }

  public formSubmit(): void {
    this.handleEntityNameDuplicator(FormFieldEnum.ENTITY_NAME, this.data.type);
    if (this.form.valid) {
      this.handleFormSubmit();
    }
  }

  private handleFormSubmit(): void {
    if (this.data.type === CatalogEntityEnum.FOLDER) {
      if (this.form.value[FormFieldEnum.FOLDER_PATH]?.length) {
        this.createGeneralFolder();
      } else {
        this.createRootFolder();
      }
    } else if (this.data.type === CatalogEntityEnum.FILE) {
      this.createProcess();
    }
  }

  private createProcess(): void {
    this.loader = true;
    const parentFolderId = this.selectedFolder?.id || this.openedFolder?.id;
    const processType = this.fileTypes.find(ft => this.form.value[FormFieldEnum.FILE_TYPE] === ft.name);
    this.subscription.add(
      this.api.createProcess(parentFolderId, processType.code, this.form.value[FormFieldEnum.ENTITY_NAME])
        .subscribe(
          () => {
            this.loader = false;
            this.showToast('common.processCreated');
            this.closeModal();
            // TODO
            let randomId = uuidv4().replace('-', '');
            randomId = randomId.substring(randomId.length - 7, randomId.length);
            this.router.navigate(
              [`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.FILE}`],
              {queryParams: {[CatalogRouteEnum._ID]: `${processType.code}/${randomId}`}}
            );
          },
          (err: HttpErrorResponse) => {
            this.loader = false;
            this.showToast(err.message);
          })
    );
  }

  private createGeneralFolder(): void {
    this.loader = true;
    const parentFolderId = this.selectedFolder?.id || this.data?.parent?.id;
    this.subscription.add(
      this.api.createFolder(parentFolderId, this.form.value[FormFieldEnum.ENTITY_NAME])
        .subscribe(
          () => {
            this.loader = false;
            this.showToast('common.folderCreated');
            this.closeModal();
            this.router.navigate([`/${AppRouteEnum.CATALOG}/${CatalogRouteEnum.FOLDER}/${parentFolderId}`]);
          },
          (err: HttpErrorResponse) => {
            this.loader = false;
            this.showToast(err.message);
          })
    );
  }

  private createRootFolder(): void {
    this.loader = true;
    this.subscription.add(
      this.api.createRootFolder(this.form.value[FormFieldEnum.ENTITY_NAME])
        .subscribe(
          () => {
            this.loader = false;
            this.showToast('common.folderCreated');
            this.closeModal();
          }, (err: HttpErrorResponse) => {
            this.loader = false;
            this.showToast(err.message);
          })
    );
  }

  private showToast(i18nKey: string): void {
    this.snackBar.open(this.translateService.instant(i18nKey), undefined, {
      duration: 1500,
      verticalPosition: 'bottom',
      horizontalPosition: 'right'
    });
  }

  public fileTypeSelected(event: MouseEvent, option: ProcessTypeModel): void {
    event.preventDefault();
    event.stopPropagation();
    this.form.get(FormFieldEnum.FILE_TYPE).patchValue(option.name);
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
    this.handleEntityNameDuplicator(FormFieldEnum.NEW_ENTITY_NAME, CatalogEntityEnum.FOLDER);
    const control = this.form.get(FormFieldEnum.NEW_ENTITY_NAME);
    if (control.valid) {
      this.createFolder(control.value);
    }
  }

  private createFolder(folderName: string): void {
    // TODO
    const folder: CatalogEntityModel = {
      id: uuidv4(),
      name: folderName,
      type: CatalogEntityEnum.FOLDER
    };
    this.addFolder(folder);
    this.closeNewFolderMode();
  }

  private addFolder(folder: CatalogEntityModel): void {
    const obj: CatalogEntityModel = this.selectedFolder || this.openedFolder;
    if (obj) {
      obj.entities ? obj.entities.unshift(folder) : obj.entities = [folder];
    }
  }

  public handleEntityNameDuplicator(controlName: string, entityType: CatalogEntityEnum): void {
    const control = this.form.get(controlName);
    if (control.value?.length) {
      let duplicatorMatched;
      if (this.selectedFolder) {
        duplicatorMatched = this.matchNameDuplicates(this.selectedFolder.entities, control.value, entityType);
      } else if (this.openedFolder) {
        duplicatorMatched = this.matchNameDuplicates(this.openedFolder.entities, control.value, entityType);
      }
      if (duplicatorMatched) {
        control.setErrors({[this.duplicatorErrorKey]: {value: control.value}});
      } else {
        this.removeControlError(controlName, this.duplicatorErrorKey);
      }
    } else {
      this.removeControlError(controlName, this.duplicatorErrorKey);
    }
  }

  private matchNameDuplicates(arr: CatalogEntityModel[], str: string, entityType: CatalogEntityEnum): CatalogEntityModel {
    if (arr) {
      return arr.find((entity: CatalogEntityModel): boolean => {
        if (entityType === entity.type) {
          return entity.name.trim().toLowerCase() === str.trim().toLowerCase();
        }
        return false;
      });
    }
    return undefined;
  }

}
