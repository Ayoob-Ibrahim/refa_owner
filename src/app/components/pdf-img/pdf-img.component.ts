import { Component, HostListener, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-pdf-img',
  templateUrl: './pdf-img.component.html',
  styleUrl: './pdf-img.component.scss',
  // encapsulation: ViewEncapsulation.Emulated
})
export class PdfImgComponent implements OnInit {
  dt_value: any = {};
  pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
  pdf_block_execution: boolean = false
  constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) data) {
    this.dt_value = { ...data }
  }

  slideIndex = 1;
  ngOnInit(): void {
    // console.log(this.dt_value)
  }


  pic_scroll(inc: Boolean) {

    if (this.dt_value.selectedone == 0 && !inc || this.dt_value.selectedone == this.dt_value['imagearr'].length - 1 && inc) {
      this.dt_value.selectedone = inc ? 0 : this.dt_value['imagearr'].length - 1;
      return;
    }
    this.dt_value.selectedone = inc ? ++this.dt_value.selectedone : --this.dt_value.selectedone

  }


  closepopup() {
    this.dialog.closeAll();
    this.dt_value = {}
  }



  pdfloaded(event: any) {
    console.log(event);
    this.pdf_block_execution = true;
  }


  @HostListener('document:keydown.escape', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    let x = event.keyCode;
    if (x === 27) {
      this.closepopup()
    }
  }
}
