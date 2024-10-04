import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[appOnlyNumbers]'
})
export class OnlyNumbersDirective {
    @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
        const allowedKeys = [
            'Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Delete'
        ];
        if (allowedKeys.includes(event.key)) {
            return;
        }
        const isNumber = /[0-9]/.test(event.key);
        if (!isNumber) {
            event.preventDefault();
        }
    }
}
