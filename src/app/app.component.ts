import { Component, ElementRef, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonServiceService } from './service/common-service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private commonService: CommonServiceService,
    private trasnServ: TranslateService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
  ) {
    this.transaltioncore('en')
  }
  title = 'refa-admin-app';

  ngOnInit() {

  }
  transaltioncore(defaultlang: string): void {
    this.trasnServ.addLangs(['en', 'ar']);
    this.trasnServ.setDefaultLang(defaultlang);
    const browserLangu: any = this.trasnServ.getBrowserLang();
    this.trasnServ.use(browserLangu)
  }


  selectln(data: any) {
    this.trasnServ.use(data.target.value)

  }


}
