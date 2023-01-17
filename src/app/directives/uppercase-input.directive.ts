import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[formControlName][uppercase]'
})
export class UppercaseInputDirective {

    constructor(
        private readonly control: NgControl
    ) { }

    @HostListener('input', ['$event.target'])
    public onInput(input: HTMLInputElement): void {
        const caretPos = input.selectionStart;
        this.control.control!.setValue(input.value.toUpperCase());
        input.setSelectionRange(caretPos, caretPos);
    }
}