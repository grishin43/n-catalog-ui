import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output, ViewChild} from '@angular/core';
import * as CodeMirror from 'codemirror';
import 'codemirror/mode/xml/xml';

@Component({
  selector: 'np-xml-editor',
  templateUrl: './xml-editor.component.html',
  styleUrls: ['./xml-editor.component.scss']
})
export class XmlEditorComponent implements OnDestroy, AfterViewInit {
  @Input() xml: string;
  @ViewChild('host') hostComponent;
  @Output() destroyed = new EventEmitter<string>();

  @Input() set isLocked(value: boolean) {
    this.readOnly = value;
    if (value != null && !!this.codeEditor) {
      this.initEditor();
    }
  };

  private codeEditor: CodeMirror;
  private codemirrorEditorParams = {
    lineNumbers: true,
    mode: 'xml',
    htmlMode: true
  };
  private readOnly: boolean;

  ngAfterViewInit(): void {
    this.initEditor();
  }

  ngOnDestroy(): void {
    const str: string = this.codeEditor.getValue();
    if (str?.trim().length) {
      this.destroyed.emit(str);
    }
  }

  private initEditor(): void {
    if (!this.codeEditor && this.hostComponent) {
      this.codemirrorEditorParams['readOnly'] = this.readOnly;
      this.codeEditor = CodeMirror.fromTextArea(this.hostComponent.nativeElement, this.codemirrorEditorParams);
    }
    if (this.codeEditor && this.xml) {
      this.codeEditor.setValue(this.xml);
    }
  }

}
