import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.scss'
})
export class SkeletonComponent implements OnChanges {


  private stan_vec: string;
  selected_skel: string;


  @Input() public get skelton_type(): string {
    return this.stan_vec;
  }

  public set skelton_type(data) {
    this.stan_vec = data.trim()
  }


  ngAfterViewInit(): void {

  }


  ngOnChanges(): void {
    this.selected_skel = this.stan_vec;
  }

}
