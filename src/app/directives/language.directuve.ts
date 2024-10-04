import { Directive, ElementRef, Renderer2, HostListener, Input, OnInit } from '@angular/core';
@Directive({
    selector: '[appDirection]'
})

export class languageDirectionDirective {
    lang: string = sessionStorage['language']
    constructor(private elementRef: ElementRef, private renderer: Renderer2) { }
    private _appdirection: string;
    @Input('appDirection')
    set appdirection(dir: string) {
        dir = dir == 'ar' ? 'right' : 'left';
        this._appdirection = dir;
        this.changeDirection(this._appdirection);
    }

    get appdirection(): string {
        return this._appdirection;
    }

    private changeDirection(dir: string) {
        this.renderer.setStyle(this.elementRef.nativeElement, 'text-align', dir);
    }


}