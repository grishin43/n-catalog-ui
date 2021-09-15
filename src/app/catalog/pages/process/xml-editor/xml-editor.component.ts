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

  private codeEditor: CodeMirror;
  private codemirrorEditorParams = {
    lineNumbers: true,
    mode: 'xml',
    htmlMode: true
  };

  ngOnDestroy(): void {
    const str: string = this.codeEditor.getValue();
    if (str?.trim().length) {
      this.destroyed.emit(str);
    }
  }

  ngAfterViewInit(): void {
    this.initEditor();
  }

  private initEditor(): void {
    if (!this.codeEditor && this.hostComponent) {
      this.codeEditor = CodeMirror.fromTextArea(this.hostComponent.nativeElement, this.codemirrorEditorParams);
    }
    if (this.codeEditor && this.xml) {
      this.codeEditor.setValue(this.xml);
    }
  }

}
