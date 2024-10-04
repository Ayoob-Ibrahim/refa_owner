import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  inject,
} from "@angular/core";
import { HammerGestureConfig } from "@angular/platform-browser";
import { CommonServiceService } from "../../service/common-service";
import { AjaxHttpService } from "../../service/ajax-http.service";
import { ServerUrl } from "../../../environments/environment.prod";
import { Subscription, asyncScheduler } from "rxjs";
import { searchpropertypipe } from "../../pipe/search-property.pipe";
import { MatDialog } from "@angular/material/dialog";
import { PdfImgComponent } from "../../components/pdf-img/pdf-img.component";
@Component({
  selector: "app-properties-approval",
  templateUrl: "./properties-approval.component.html",
  styleUrl: "./properties-approval.component.scss",
  providers: [searchpropertypipe],
})
export class PropertiesApprovalComponent implements OnInit, OnDestroy {
  @ViewChild("carousel", { static: true }) carousel: ElementRef;
  @Input() images: string[] = [];
  search_property_str: string;
  constructor(
    private ajax: AjaxHttpService,
    private commos: CommonServiceService,
    private renderer: Renderer2
  ) {}
  direction: string = "en";
  private langBehavior: Subscription;
  property_show: Boolean = true;
  properties: any[];
  get_property_data: any;

  ngOnInit(): void {
    this.languageGetter();
    this.get_list_properties();
  }

  languageGetter(): void {
    this.langBehavior = this.commos.languagetter().subscribe((data) => {
      this.direction = data;
    });
  }

  ngOnDestroy(): void {
    if (this.langBehavior) {
      this.langBehavior.unsubscribe();
    }
  }

  get_list_properties(): void {
    this.commos.presentLoader();
    this.ajax
      .ajaxPostWithBody(ServerUrl.liveDomain + ServerUrl.widgetsUrl, {
        header: {
          Name: "propertywidgets",
          function: true,
          where: "?datas=p.status=1",
        },
      })
      .subscribe((res) => {
        this.properties = [...JSON.parse(res.datavalue)];
        this.commos.dismissLoader();
      });
  }

  onSwipeLeft(event: any, data) {
    console.log(event);

    if (data.selectedindex > 0) {
      data.selectedindex = data.selectedindex - 1;
    }

    console.log(data.selectedindex, "left");
  }

  onSwipeRight(event: any, data) {
    if (data.selectedindex < data.url.length - 1) {
      data.selectedindex = data.selectedindex + 1;
    }
    console.log(data.selectedindex, "right");
  }
  headerMenu = {
    list: [{ name: "Properties" }],
    form: [{ name: "PROPERTY DETAILS" }],
  };
  selectedIndex = 0;
  selectedIndexs(d: any) {
    this.selectedIndex = d;
  }
  gridSingledata;
  property_details(id?, data?) {
    this.gridSingledata = data;
    if (id) {
      this.commos.presentLoader();
      this.ajax
        .ajaxget(
          ServerUrl.liveDomain +
            ServerUrl.formsUrl +
            `?name=propertywidgets&primary=${id}&where`
        )
        .subscribe((res) => {
          res = Object.assign(res.datavalue[0], { declarecheck: true });
          this.get_property_data = res;
          this.get_property_data["thumb_image_manipulated"] = Object.entries(
            JSON.parse(this.get_property_data.documents)["thumb_img"]
          );
          this.get_property_data["side_card_data"] = { ...data };
          console.log(this.get_property_data);
          this.property_show = !this.property_show;
          this.commos.dismissLoader();
        });
    } else this.property_show = !this.property_show;
  }

  pic_scroll(data, inc: Boolean, event) {
    event.stopPropagation();
    let { selectedindex, url } = data;
    if (
      (selectedindex == 0 && !inc) ||
      (selectedindex == url.length - 1 && inc)
    ) {
      data.selectedindex = inc ? 0 : url.length - 1;
      return;
    }
    inc ? data.selectedindex++ : data.selectedindex--;
  }

  onImageLoad(id: string) {
    const task = () =>
      this.renderer.setStyle(document.getElementById(id), "display", "none");
    asyncScheduler.schedule(task, 1000);
  }

  async open_property_details(id: number): Promise<void> {
    this.commos.presentLoader();
    // this.get_list_of_parental_drop_down().then(() => {
    //   this.crud_type = 'view';
    //   this.showGrid = false;
    //   this.ajax.ajaxget(ServerUrl.liveDomain + ServerUrl.formsUrl + `?name=propertywidgets&primary=${id}&where`).subscribe(res => {
    //     res = Object.assign(res.datavalue[0], { declarecheck: true });
    //     this.get_property_data = res
    //     this.get_property_data['thumb_image_manipulated'] = Object.entries(JSON.parse(this.get_property_data.documents)['thumb_img'])
    //     this.get_property_type({ target: { value: res.category } });
    //     this.heirachy_drop_down({ target: { value: res.country } }, 'listofprovinces', 'country_id', 'list_provinces', 'list_countreis', 'country_name');
    //     console.log(this.get_property_data, 'get')
    //     this.commos.dismissLoader();
    //   })
    // })
  }

  public dialog: MatDialog = inject(MatDialog);

  pdf_img_viewer(imgAr, index) {
    let newarr = imgAr.map((value) => value[1]);
    const dialogRef = this.dialog.open(PdfImgComponent, {
      disableClose: true,
      width: "800px",
      height: "85vh",
      panelClass: "custom-container",
      data: {
        imagearr: newarr,
        selectedone: index,
        type: "image_array",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
