import {AfterViewInit, Component, ElementRef, HostListener, Inject, OnDestroy, ViewChild} from '@angular/core';
import {AngularEditorComponent, AngularEditorConfig} from '@kolkov/angular-editor';
import {WysiwygHelper} from '../../../helpers/wysiwyg.helper';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'np-documentation-dialog',
  templateUrl: './documentation-dialog.component.html',
  styleUrls: ['./documentation-dialog.component.scss']
})
export class DocumentationDialogComponent implements AfterViewInit, OnDestroy {
  public editorConfig: AngularEditorConfig = WysiwygHelper.config;
  public minHeight = parseInt(this.editorConfig.minHeight, 10);
  public canResize: boolean;
  public editorTextarea: HTMLElement;
  public matBottomSheet: HTMLElement;

  @ViewChild('resizer') resizer: ElementRef;

  @HostListener('window:dragstart', ['$event']) onDrag(e: DragEvent): void {
    if (this.canResize) {
      this.canResize = false;
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.canResize) {
      const newHeight: number = Math.round(window.innerHeight - event.clientY);
      if (newHeight <= window.innerHeight) {
        this.editorConfig.height = `${newHeight - this.editorAreaVerticalGutters}px`;
      } else {
        this.editorConfig.height = `${window.innerHeight - this.editorAreaVerticalGutters}px`;
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    const sheetHeight: number = this.matBottomSheet?.offsetHeight;
    const resizerHeight: number = this.resizer?.nativeElement?.offsetHeight;
    const calcHeight: number = sheetHeight + resizerHeight;
    if (calcHeight >= window.innerHeight) {
      const textareaTop: number = Math.floor(this.editorTextarea?.getBoundingClientRect().top);
      const sheetBottomPadding: number = parseInt(
        window.getComputedStyle(this.matBottomSheet, null).getPropertyValue('padding-bottom'), 10
      );
      const areaGutters: number = textareaTop + sheetBottomPadding;
      this.editorConfig.height = `${window.innerHeight - areaGutters}px`;
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(): void {
    this.canResize = false;
  }

  @HostListener('document:mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('bottom-sheet-resizer')) {
      this.canResize = true;
    }
  }

  constructor(
    private bottomSheetRef: MatBottomSheetRef<DocumentationDialogComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public htmlContent: string
  ) {
  }

  ngAfterViewInit(): void {
    this.editorTextarea = document.querySelector('.angular-editor-textarea');
    this.matBottomSheet = this.editorTextarea?.closest('mat-bottom-sheet-container');
  }

  ngOnDestroy(): void {
    this.closeSheet();
  }

  public closeSheet(): void {
    this.bottomSheetRef.dismiss(this.htmlContent);
  }

  private get editorAreaVerticalGutters(): number {
    const textareaHeight: number = this.editorTextarea?.getBoundingClientRect().height;
    const sheetHeight: number = this.matBottomSheet?.getBoundingClientRect().height;
    const resizerHeight = this.resizer?.nativeElement?.getBoundingClientRect().height;
    let diff: number;
    if (textareaHeight && sheetHeight && sheetHeight) {
      diff = Math.floor(sheetHeight - textareaHeight + resizerHeight);
    }
    return diff || 100;
  }

}
