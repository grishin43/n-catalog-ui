import {AngularEditorConfig} from '@kolkov/angular-editor';

export class WysiwygHelper {

  public static get config(): AngularEditorConfig {
    return {
      editable: true,
      spellcheck: true,
      height: '15rem',
      minHeight: '10rem',
      translate: 'no',
      defaultParagraphSeparator: 'p',
      defaultFontName: 'Arial',
      toolbarHiddenButtons: [
        ['bold']
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
