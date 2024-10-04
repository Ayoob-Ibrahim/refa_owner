import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";

@NgModule({
    declarations: [],
    imports: [CommonModule,ToastModule],
    providers: [MessageService],
    exports: [ToastModule],
})
export class libraryModule { }