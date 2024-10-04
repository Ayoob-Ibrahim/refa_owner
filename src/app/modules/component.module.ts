import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { JqxModuleModule } from './jqx-module.module';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { DcComponentComponent } from '../components/dc-component/dc-component.component';

import { jqxComboBoxModule } from 'jqwidgets-ng/jqxcombobox';
import { jqxGridModule } from 'jqwidgets-ng/jqxgrid';
import { SvgComponentComponent } from '../components/svg-component/svg-component.component';
import { PropertiesApprovalComponent } from '../pages/properties-approval/properties-approval.component';
import { JqxModuleModule } from './jqx-module.module';
import { TestadminComponent } from '../pages/testadmin/testadmin.component';
import { DirectivesModuleModule } from './directives-module.module';
import { OpenLayerComponent } from '../components/open-layer/open-layer.component';
import { libraryModule } from './libraries.modules';
import { searchpropertypipe } from '../pipe/search-property.pipe';
import { FormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SkeletonComponent } from '../components/skeleton/skeleton.component';
import { PdfImgComponent } from '../components/pdf-img/pdf-img.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';


@NgModule({
  declarations: [
    DashboardComponent, DcComponentComponent, SvgComponentComponent, PropertiesApprovalComponent,
    TestadminComponent, OpenLayerComponent, searchpropertypipe, SkeletonComponent, PdfImgComponent
  ],
  imports: [CommonModule, JqxModuleModule, DirectivesModuleModule, libraryModule,
    FormsModule, TranslateModule, PdfViewerModule],
  exports: [SvgComponentComponent, DcComponentComponent, OpenLayerComponent, libraryModule,
    SkeletonComponent, DirectivesModuleModule, TranslateModule, PdfImgComponent,PdfViewerModule]
})
export class ComponentModule { }
