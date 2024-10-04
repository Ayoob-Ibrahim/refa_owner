import { AfterViewInit, Component, Input, OnChanges, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-svg-component',
  templateUrl: './svg-component.component.html',
  styleUrl: './svg-component.component.scss'
})
export class SvgComponentComponent implements OnChanges, AfterViewInit {


  private stan_vec: string;
  selected_svg: string;


  @Input() public get svgType(): string {
    return this.stan_vec;
  }

  public set svgType(data) {
    this.stan_vec = data.trim()
  }


  ngAfterViewInit(): void {

  }


  ngOnChanges(): void {
    this.selected_svg = this.stan_vec;
  }


}
