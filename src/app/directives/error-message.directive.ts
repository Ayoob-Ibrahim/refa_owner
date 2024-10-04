import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appErrorMessage]',
})
export class ErrorMessageDirective {

  @Input() custom_validation;

  constructor(private elementRef: ElementRef, private renderer: Renderer2,) { }


  @HostListener('input') oninputchnage(eventData: Event) {
    let ele: HTMLElement = this.elementRef.nativeElement;
    if (ele['value'] != '' && this.classIncludes(ele, 'border-invalid')) {
      ele = this.removechildnodes(ele, this.elementRef.nativeElement, 'border-invalid', 'small')
      return;
    }
  }


  @HostListener('blur') onblur(eventData: Event) {

    let ele: HTMLElement = this.elementRef.nativeElement;
    let isInvalid = this.classIncludes(ele, 'ng-invalid') && !this.classIncludes(ele, 'border-invalid')
      || !ele['value'].trim() && !this.classIncludes(ele, 'border-invalid');

    if (this.classIncludes(ele, 'border-invalid') && ele['value'].trim()) {
      ele = this.removechildnodes(ele, this.elementRef.nativeElement, 'border-invalid', 'small')
      return;
    }

    if (!isInvalid) return;
    this.renderer.addClass(ele, 'border-invalid');
    {
      const small_tg = this.elementCreation('small', 'red', '10px', 'This Field is mandatory')
      this.renderer.appendChild(ele.parentNode, small_tg);
      this.renderer.removeClass(ele, 'bottom-margin');
    }
  }


  elementCreation(tag, colr, ft_sz, txt): HTMLElement {
    const new_ele = document.createElement(tag);
    new_ele.textContent = txt;
    new_ele.style.color = colr;
    new_ele.style.fontSize = ft_sz;
    return new_ele;
  }


  classIncludes(ele: HTMLElement, class_: string): Boolean {
    let Invalid: Boolean = ele.className.includes(class_);
    return Invalid;
  }


  removechildnodes(ele: HTMLElement, nativeElement: any, classname: string, removeChild: string): HTMLElement {
    this.renderer.removeClass(nativeElement, classname);
    ele.parentNode.removeChild(ele.parentNode.querySelector(removeChild));
    return ele;
  }



}
