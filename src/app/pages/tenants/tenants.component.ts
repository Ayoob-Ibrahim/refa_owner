import {
  Component,
  OnDestroy,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { SettingsComponent } from "../settings/settings.component";
import { CommonModule } from "@angular/common";
import { ComponentModule } from "../../modules/component.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonServiceService } from "../../service/common-service";
import { AjaxHttpService } from "../../service/ajax-http.service";
import { ServerUrl } from "../../../environments/environment.prod";
import { Subscription, asyncScheduler } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { PdfImgComponent } from "../../components/pdf-img/pdf-img.component";

@Component({
  selector: "app-tenants",
  standalone: true,
  imports: [
    SettingsComponent,
    CommonModule,
    ComponentModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: "./tenants.component.html",
  styleUrl: "./tenants.component.scss",
})
export class TenantsComponent implements OnInit, OnDestroy {
  abcd_grid_wr: any;
  gridloader: Boolean = false;
  selectedIndex = signal<number>(0);
  tenant_grid_show: boolean = true;
  data_values: any = {};
  tenant_description: any = {};
  Ishow_prop: Boolean = false;
  GridInfo = {
    quarterGrid: { height: 280, rows: 3, setClass: "racDashboard" },
    halfGrid: { setClass: "racDashboard", height: 330, rows: 10 },
    fullgrid: { setClass: "rac__Dashboard", height: "68vh", rows: 10 },
  };
  direction: string = "en";
  private langBehavior: Subscription;
  innerGrid_wr: any;
  constructor(
    private commos: CommonServiceService,
    private ajax: AjaxHttpService
  ) {
    this.effects_signal();
  }
  ngOnInit(): void {
    this._get_grid_data();
    this.languageGetter();
  }

  ngOnDestroy(): void {
    if (this.langBehavior) {
      this.langBehavior.unsubscribe();
    }
  }

  languageGetter(): void {
    this.langBehavior = this.commos.languagetter().subscribe((data) => {
      this.direction = data;
    });
  }
  _get_grid_data(): Boolean {
    this.appliedft = false;
    this.abcd_grid_wr = this.commos.grid_body(
      `get_tenant_details_form_data`,
      true,
      `?datas=u.usertype_id=1 and u.status='Tenant'`
    );
    this.skeletonDismiss();
    return true;
  }

  effects_signal() {
    effect(() => {
      const items = this.selectedIndex();
    });
  }

  headerMenu = {
    list: [{ name: "list_of_tenants" }],
    form: [{ name: "tenant_information" }],
  };

  abcd_data_emit(event) {
    let { data } = event;
    this.commos.presentLoader();
    this.tenant_grid_show = false;
    this.data_values = new Object();
    this.ajax
      .ajaxget(
        ServerUrl.liveDomain +
          ServerUrl.formsUrl +
          `?name=get_tenant_details_form_data&primary&where=?datas=u.users_id=${data["Users Id"]}`
      )
      .subscribe((res) => {
        let {
          property_details,
          docs_data: { documents = {"documents" : ""} , proofdoc },
          image,
        } = Object.assign(res["datavalue"][0], {
          docs_data: JSON.parse(res["datavalue"][0]["income_proof"]),
        });
        documents = Object.values(documents)?.[0]??"";
        proofdoc = Object.values(proofdoc)[0];
        property_details.map((value, index) => {
          let { thumb_img } = JSON.parse(value["property_image"]);
          property_details[index]["image_array"] = Object.values(thumb_img);
        });
        if (image) image = Object.values(JSON.parse(image)["profile"])[0];
        Object.assign(this.data_values, res["datavalue"][0], {
          documents: documents,
          proofdoc: proofdoc,
          property_details: property_details,
          image: image,
        });
        this.innerGrid_wr = this.commos.grid_body(
          `tenant_emis`,
          true,
          `?datas=${data["Users Id"]}`
        );

        this.commos.dismissLoader();
        console.log(this.data_values);
      });
  }

  closeform() {
    this.tenant_grid_show = true;
  }

  propertiesDetail(data?) {
    if (data) {
      this.commos.presentLoader();
      this.ajax
        .ajaxget(
          ServerUrl.liveDomain +
            ServerUrl.formsUrl +
            `?name=propertyData&primary&where=?datas=p.property_id=${data["property_id"]}`
        )
        .subscribe((res) => {
          Object.assign(this.tenant_description, res["datavalue"][0], data);
          this.Ishow_prop = !this.Ishow_prop;
          // console.log(this.tenant_description)
          this.commos.dismissLoader();
        });
    } else this.Ishow_prop = !this.Ishow_prop;
  }

  doc_download(url: string, docs: string): void {
    let type = url.split(".")[url.split(".").length - 1];
    if (type.toLowerCase() == "pdf") {
      this.pdf_img_viewer(url, "pdf", docs);
    } else {
      this.pdf_img_viewer(url, "image", docs);
    }
  }

  searchstr: string;
  appliedft: Boolean = false;
  searchft(data: string) {

    // if (data.startsWith('+')) {
    //   data = data.replace('+','%2B');
    // }

    if (!data.trim()) return;
    this.abcd_grid_wr = this.commos.grid_body(
      `Listofusers`,
      false,
      `or=(username.ilike(any).{${data}*},mobile.ilike(any).{*${data}*},location.ilike(any).{${data}*}) & usertype_id=eq.1 & status=eq.Tenant`
    );
    this.appliedft = true;
    this.skeletonDismiss();
  }

  skeletonDismiss() {
    this.gridloader = true;
    const loaderDismiss = () => (this.gridloader = false);
    asyncScheduler.schedule(loaderDismiss, 1000);
  }

  resetgrid() {
    this._get_grid_data();
    this.searchstr = "";
  }

  pdf_img_viewer(value, type, name: string) {
    this.commos.pdf_img_viewer(value, type, name);
  }

  imageView(imgAr, index) {
    this.commos.imageView(imgAr, index);
  }
}
