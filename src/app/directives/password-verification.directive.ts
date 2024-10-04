import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appPasswordVerification]',
})
export class PasswordVerificationDirective {
  spanTag: HTMLElement;
  ispassword: boolean = false;
  constructor(private elementRef: ElementRef, private renderer: Renderer2,) { }



  @HostListener('focus') onfoucs(eventData: Event) {
    let ele: HTMLElement = this.elementRef.nativeElement;
    if (!this.Is_span(ele) || this.ispassword) return;
    this.addingSpanTag()
  }


  Is_span(ele: HTMLElement): boolean {
    let proceed: boolean = true
    ele.parentNode.childNodes.forEach(value => {
      if (value.nodeName == 'SPAN') {
        proceed = false
      }
    })
    return proceed
  }



  addingSpanTag() {
    let ele: HTMLElement = this.elementRef.nativeElement;
    this.spanTag = elementCreation('span', this.renderer);
    const infoTag = elementCreation('i', this.renderer)
    this.addClassList(infoTag, ['bi', 'bi-info-circle']);
    this.addClassList(this.spanTag, ['info-span']);
    this.spanTag.appendChild(infoTag)
    this.addingTooltip(
      this.spanTag,
      `password should contains atleast one uppercase and lowercase and one special characters`
    )
    this.renderer.appendChild(ele.parentNode, this.spanTag);
    function elementCreation(type: string, renderer: Renderer2): HTMLElement {
      return renderer.createElement(type);
    }
  }


  addingTooltip(ele: HTMLElement, text: string) {
    this.renderer.setAttribute(ele, 'title', text);
  }

  addClassList(element: any, classes: string[]) {
    classes.forEach(className => {
      this.renderer.addClass(element, className);
    });
  }

  @HostListener('input', ['$event']) keypress(event: Event) {
    let pass = event.target['value']
    let ele: HTMLElement = this.elementRef.nativeElement

    if (this.passwordpatterncheck(pass)) {
      this.ispassword = true;
      this.renderer.removeChild(ele.parentNode, this.spanTag);
    } else if (this.Is_span(ele)) {
      this.ispassword = false;
      this.addingSpanTag()
    }

  }

  passwordpatterncheck(pass: string) {
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
    return passwordPattern.test(pass);
  }

}
