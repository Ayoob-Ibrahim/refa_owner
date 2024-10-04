import { Component, OnInit, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonServiceService } from '../service/common-service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
  constructor(private trasnServ: TranslateService, private commonService: CommonServiceService, private renderer: Renderer2,) { }
  ngOnInit(): void {
    this.languagecontrol()
  }


  languagecontrol() {
    this.trasnServ.use(sessionStorage['language'])
    this.commonService.languagesetter()
    this.commonService.languageInitilazation(this.renderer);
  }
}
