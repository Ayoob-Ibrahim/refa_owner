import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { jqxDropDownListModule } from 'jqwidgets-ng/jqxdropdownlist';

import { jqxGridModule } from 'jqwidgets-ng/jqxgrid';

@NgModule({
    declarations: [],
    imports: [CommonModule, jqxGridModule],
    exports: [jqxGridModule],
})
export class JqxModuleModule { }
