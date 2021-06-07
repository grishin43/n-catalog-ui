import {Component, Input, OnInit} from '@angular/core';
import {v4 as uuidv4} from 'uuid';
import {MatAutocomplete} from '@angular/material/autocomplete';

@Component({
  selector: 'np-input',
  templateUrl: './np-input.component.html',
  styleUrls: ['./np-input.component.scss']
})
export class NpInputComponent implements OnInit {
  @Input() label: string;
  @Input() disabled: boolean;
  @Input() type = 'text';
  @Input() placeholder: string;
  @Input() autocomplete: MatAutocomplete;

  public inputId: string;

  constructor() {
  }

  ngOnInit(): void {
    this.inputId = uuidv4();
  }

  public get typeClass(): string {
    return `input-type-${this.type}`;
  }

  public onSearchCrossClicked(e: MouseEvent, inputRef: HTMLInputElement ): void {
    e.preventDefault();
    e.stopPropagation();
    inputRef.value = '';
  }

}
