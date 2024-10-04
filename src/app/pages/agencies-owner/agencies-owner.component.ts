import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  effect,
  inject,
  signal,
} from "@angular/core";
import { ComponentModule } from "../../modules/component.module";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription, asyncScheduler, map } from "rxjs";
import { CommonServiceService } from "../../service/common-service";
import { AjaxHttpService } from "../../service/ajax-http.service";
import { ServerUrl } from "../../../environments/environment.dev";
import Swal from "sweetalert2";
import { FormsModule } from "@angular/forms";
import { MessageService } from "primeng/api";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-agencies-owner",
  standalone: true,
  imports: [CommonModule, ComponentModule, FormsModule],
  templateUrl: "./agencies-owner.component.html",
  styleUrl: "./agencies-owner.component.scss",
})
export class AgenciesOwnerComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  abcd_grid_wr: any;
  headerMenu = {
    list: [
      { name: "list_of_approvals" },
      { name: "list_of_agencies_owner" },
      { name: "list_of_rejection" },
    ],
    form: [{ name: "profile_information_form" }],
  };
  abcd_grid_show: boolean = true;
  description_template: boolean = false;
  selectedIndex = signal<number>(0);
  agencies_description: any;
  GridInfo = {
    quarterGrid: { height: 280, rows: 3, setClass: "racDashboard" },
    halfGrid: { setClass: "racDashboard", height: 330, rows: 10 },
    fullgrid: { setClass: "rac__Dashboard", height: "68vh", rows: 10 },
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private commos: CommonServiceService,
    private ajax: AjaxHttpService,
    private message: MessageService
  ) {
    this.effects_signal();
  }
  ngOnDestroy(): void {
    if (this.commos.dashboard_data_get()) {
      this.commos.dashboard_data_set(undefined);
    }
    if (this.langBehavior) {
      this.langBehavior.unsubscribe();
    }
  }
  form_data: any;
  paramDt: Boolean = false;
  approval_gird: any;
  direction: string = "en";
  private langBehavior: Subscription;
  isdocs = false;

  ngAfterViewInit(): void {}
  ngOnInit(): void {
    this.paramData();
    this.languageGetter();
  }

  languageGetter(): void {
    this.langBehavior = this.commos.languagetter().subscribe((data) => {
      this.direction = data;
    });
  }

  paramData(): void {
    let data = this.route.queryParamMap.pipe(
      map((params) => {
        return {
          data: params.get("data"),
          id: params.get("id"),
        };
      })
    );
    data.subscribe((param) => {
      if (param ? atob(param.data) == "check-subject" : false) {
        this._get_form_data(`Listofagencies/owner`, atob(param.id));
        this.abcd_grid_show = false;
        this.paramDt = true;
      }
    });
  }

  dashbard_subject(): void {
    let data: object = this.commos.dashboard_data_get();
    if (
      data.hasOwnProperty("data")
        ? this.commos.isentry_dash_data(data["data"], "agencies-owner")
        : false
    ) {
      this._get_form_data(data["data"]["Alias name"], data["data"]["ID"]);
      this.abcd_grid_show = data["data"]["View Type"] == "Form" ? false : true;
    }
  }

  _get_form_data(reqpar: string, id: string): void {
    this.form_data = undefined;
    this.commos.presentLoader();
    this.ajax
      .ajaxget(
        `${ServerUrl.liveDomain}${ServerUrl.formsUrl}?name=${reqpar}&primary&where=${id}`
      )
      .subscribe((res) => {
        let fal_docs = Object.entries(
          JSON.parse(res.datavalue[0]["documents"])
        )[0][1];

        let fal_docs1 = [];
        Object.values(JSON.parse(res.datavalue[0]["documents"])).map(
          (val: string[]) => {
            fal_docs1.push(Object.values(val)[0]);
          }
        );
        console.log(fal_docs1, "faldocs111");

        let { property_deatils, picture } = res.datavalue[0];
        if (property_deatils) {
          property_deatils = JSON.parse(property_deatils);
          for (let i = 0; i < property_deatils.length; i++) {
            property_deatils[i]["updatedimg"] = Object.entries(
              property_deatils[i]["url"]
            )[0][1];
          }
        }
        if (picture) {
          picture = Object.values(JSON.parse(picture)["profile"])[0];
        }

        this.form_data = {
          ...res.datavalue[0],
          fal_docs: [...fal_docs1],
          property_details: property_deatils,
          profile_pic: picture,
        };
        console.log(this.form_data, "form");

        this.commos.dismissLoader();
      });
  }
  abcd_data_emit(event) {
    this._get_form_data(
      "Listofagencies/owner",
      `?datas=u.users_id=${event["data"]["primaryid"]}`
    );
    if (this.selectedIndex() === 1) {
      // console.log('test')
    }
    this.abcd_grid_show = false;
  }

  effects_signal() {
    effect(() => {
      const items = this.selectedIndex();
      if (this.abcd_grid_show) {
        this.abcd_grid_wr =
          this.selectedIndex() === 0
            ? this.commos.grid_body(
                "Listofagencies/owner",
                true,
                `?datas=u.status ilike 'Under Review'`
              )
            : this.selectedIndex() === 1
            ? this.commos.grid_body(
                "Listofagencies/owner",
                true,
                `?datas=(u.status ilike 'active' OR u.status ilike 'suspended') `
              )
            : this.commos.grid_body(
                "Listofagencies/owner",
                true,
                `?datas=(u.status ilike 'reject') `
              );
        this.appliedft = false;
        this.searchstr = "";
      }
    });
  }

  closeform() {
    this.isdocs = false;
    if (this.paramDt) {
      this.abcd_grid_wr = this.commos.grid_body(
        "Listofagencies/owner",
        true,
        `?datas=u.status ilike 'Under Review'`
      );
      this.paramDt = false;
    }

    // if (this.selectedIndex() == 0) this.abcd_grid_wr = this.commos.grid_body('Listofagencies/owner', true, `?datas=u.status ilike 'Under Review'`)
    if (this.description_template) this.description_template = false;
    else this.abcd_grid_show = true;
  }
  property_review(data) {
    this.agencies_description = data;
    this.agencies_description["updatedimage"] = Object.values(data.url);
    // console.log(this.agencies_description)
    this.description_template = true;
  }

  doc_download(url: string, docs: string): void {
    let type = url.split(".")[url.split(".").length - 1];
    if (type.toLowerCase() == "pdf") {
      this.commos.pdf_img_viewer(url, "pdf", docs);
    } else {
      this.commos.pdf_img_viewer(url, "image", docs);
    }
  }

  status_change(id: number, status: string, data, msg?): void {
    let { company_code } = data;
    let content = ` Your request "${company_code} information" submitted for approval is  ${
      status == "Reject" ? `rejected for "${msg}"` : `approval is approved`
    }`;
    this.commos.presentLoader();
    this.ajax
      .ajaxPostWithBody(ServerUrl.liveDomain + ServerUrl.workFlow, {
        header: {
          name: "agent",
          mode: "step2",
          requestFor: status == "Reject" ? "rejected" : "accepted",
          findby: [data["email"]],
          comments: status == "Reject" ? content : "",
          lang:
            sessionStorage["language"] == "en"
              ? sessionStorage["language"]
              : "Ar",
        },
        body: {},
      })
      .subscribe((res) => {
        if (res.reflex) {
          this.commos.dismissLoader();
          this.abcd_grid_wr = this.commos.grid_body(
            "Listofagencies/owner",
            true,
            `?datas=u.status ilike 'Under Review'`
          );
          this.abcd_grid_show = true;
        } else {
          this.commos.dismissLoader();
          this.message.add({
            severity: "error",
            detail: `${res.error}`,
          });
        }
      });
  }

  openRejectModal(id: number, status: string, data) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-primary btnMarginLeft sweal-btn",
        cancelButton: "btn btnBgColorWhite sweal-btn",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        html: `
      <div>
        <i style="margin: 0; font-size: 3.8rem; color: red" class="bi bi-exclamation-circle"></i>
        <h2 style="margin-top: 0; margin-bottom: 0; margin-top: 0.5rem; font-size: 1rem; ">Are you sure you want to Reject the ${"userType"} ${"name"} ?</h2>
      </div> `,
        input: "textarea",
        inputAttributes: {
          autocapitalize: "off",
          style:
            "height: 80px !important; margin-top: 0.5rem; font-size: .875rem;resize:none",
          placeholder: "Add Comment",
        },
        showCancelButton: true,
        confirmButtonText: `${this.translate.instant('reject')}`,
        cancelButtonText: `${this.translate.instant('cancel')}`,
        reverseButtons: true,
        allowOutsideClick: false,
        preConfirm: async (comment) => {
          try {
            if (!comment)
              swalWithBootstrapButtons.showValidationMessage(
                `${this.translate.instant('pl_add_comment')}`
              );
          } catch (error) {
            console.error(error);
          }
        },
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.status_change(id, status, data, result.value);
        }
      });
  }

  private translate: TranslateService = inject(TranslateService);

  // serverfilter
  searchstr: string;
  appliedft: Boolean = false;
  gridloader: Boolean = false;
  searchft(data: string) {
    // ?datas=u.status ilike 'active' and (u.username ilike 'a%25%25' or u.mobile ilike 'a%25%25' or u.location ilike 'a%25%25')
    // if (data.startsWith('+')) {
    //   data = data.replace('+','%2B');
    // }
    if (!data.trim()) return;
    this.abcd_grid_wr = this.commos.grid_body(
      `Listofagencies/owner`,
      true,
      `?datas= ${
        this.selectedIndex() === 0
          ? `u.status ilike 'Under Review'`
          : ` (u.status ilike 'active' OR u.status ilike 'suspended')`
      }  and (u.username ilike '${data}%25%25' or u.mobile ilike '%25%25${data}%25%25' or u.email ilike '${data}%25%25')`
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
    this.abcd_grid_wr = this.commos.grid_body(
      `Listofagencies/owner`,
      true,
      `${
        this.selectedIndex() === 0
          ? `?datas=u.status ilike 'Under Review'`
          : `?datas=(u.status ilike 'active' OR u.status ilike 'suspended')`
      }`
    );
    this.searchstr = "";
    this.appliedft = false;
    this.skeletonDismiss();
  }

  user_susped(data: any): void {
    this.commos.presentLoader();
    let { username, primaryid, issuspend, user_status, email } = data;
    console.log(data);
    this.ajax
      .ajaxPut(ServerUrl.liveDomain + ServerUrl.formsUrl, {
        header: {
          name: "Listofusers",
          where: "",
          message: `This ${username} has been ${
            issuspend ? "unsuspended" : "suspended"
          }`,
          status: "edit",
          primaryvalue: false,
          notification: true,
          rolename: "REFA ADMIN",
          lang:
            sessionStorage["language"] == "en"
              ? sessionStorage["language"]
              : "Ar",
        },
        body: {
          users_id: primaryid,
          username: username,
          email: email,
          status: user_status == "Active" ? "Suspended" : "Active",
          issuspend: !issuspend,
        },
      })
      .subscribe((res) => {
        if (res.reflex) {
          this.message.add({
            severity: "success",
            detail: `${username} ${issuspend ? 
            this.translate.instant('has_been_unsus_succ') :
            this.translate.instant('has_been_sus_succ')}`
            // detail: `This ${username} has been ${
            //   issuspend ? "unsuspended" : "suspended"
            // } successfully`,
          });
        }
        this.closeform();
      });
      this.commos.dismissLoader();
  }

  pdf_img_viewer(value, type, name: string) {
    this.commos.pdf_img_viewer(value, type, name);
  }

  imageView(imgAr, index) {
    this.commos.imageView(imgAr, index);
  }
}
