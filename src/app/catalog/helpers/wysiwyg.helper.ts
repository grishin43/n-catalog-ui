import {AngularEditorConfig} from '@kolkov/angular-editor';

export class WysiwygHelper {

  public static get config(): AngularEditorConfig {
    return {
      editable: true,
      spellcheck: true,
      height: '360px',
      minHeight: '200px',
      translate: 'no',
      defaultParagraphSeparator: 'p',
      defaultFontName: 'Arial',
      toolbarHiddenButtons: [
        [
          'insertImage',
          'insertVideo'
        ]
      ],
      customClasses: [
        {
          name: 'quote',
          class: 'quote',
        },
        {
          name: 'redText',
          class: 'redText'
        },
        {
          name: 'titleText',
          class: 'titleText',
          tag: 'h1',
        },
      ]
    };
  }

}
