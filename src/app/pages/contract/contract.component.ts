import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit, effect, inject, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonServiceService } from "../../service/common-service";
import { MessageService } from "primeng/api";
import { AjaxHttpService } from "../../service/ajax-http.service";
import { ComponentModule } from "../../modules/component.module";
import { ServerUrl } from "../../../environments/environment.prod";
import { FormsModule } from "@angular/forms";
import { Subscription, asyncScheduler, forkJoin, map } from "rxjs";
import Swal from "sweetalert2";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-contract",
  standalone: true,
  imports: [CommonModule, ComponentModule, FormsModule],
  templateUrl: "./contract.component.html",
  styleUrl: "./contract.component.scss",
})
export class ContractComponent implements OnInit, OnDestroy {
  abcd_grid_show: boolean = true;
  abcd_grid_wr: any;
  selectedIndex = signal<number>(0);
  data_values: any;
  rent_rev: Boolean = false;
  exist_data: any = {};
  paramDT: boolean = false;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private commos: CommonServiceService,
    private message: MessageService,
    private ajax: AjaxHttpService
  ) {
    this.effects_signal();
  }
  direction: string = "en";
  private langBehavior: Subscription;
  ngOnInit(): void {
    this.languageGetter();
    this.paramData();
    this.get_ejar_fee();
  }

  paramData(): void {
    let data = this.activatedRoute.queryParamMap.pipe(
      map((params) => {
        return {
          data: params.get("data"),
          id: params.get("primary"),
          type: params.get("tabtype"),
          stringurl: params.get("id"),
          aliasName: params.get("aliasName"),
        };
      })
    );
    data.subscribe((param) => {
      if (param ? atob(param.data) == "check-subject" : false) {
        this.paramDT = true;
        this.selectedIndex.set(parseInt(param.type));
        this.ajax
          .ajaxget(
            ServerUrl.liveDomain +
              ServerUrl.formsUrl +
              `?name=${param.aliasName}&primary&where=${atob(param.stringurl)}`
          )
          .subscribe((res) => {
            res = { ...res["datavalue"][0] };

            Object.assign(
              res,
              (res["Properties"] = res["properties"]),
              (res["EMI Details"] = res["emi_details"])
            );

            this.abcd_data_emit({
              data: { ...res },
            });
          });
      }
    });
  }

  abcd_data_emit(event) {
    if (this.selc == 1 || this.selc == 2 || this.selc == 0) {
      this.data_values = event.data;
      this.data_values["Properties"] = JSON.parse(event.data["Properties"]);
      this.data_values["EMI Details"] = JSON.parse(event.data["EMI Details"]);
      this.data_values["url"] = Object.values(
        this.data_values["Properties"]["url"]
      )[0];
      if (this.selc == 1 || this.selc == 2) this.renewal_grid_data(event);
      this.abcd_grid_show = false;
    } else if (this.selc == 3) {
      this.exisitig_grid_data(event);
    }
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

  selc: number = 0;
  GridInfo = {
    quarterGrid: { height: 280, rows: 3, setClass: "racDashboard" },
    halfGrid: { setClass: "racDashboard", height: 330, rows: 10 },
    fullgrid: { setClass: "rac__Dashboard", height: "68vh", rows: 10 },
  };

  effects_signal() {
    effect(() => {
      const items = this.selectedIndex();
      this.selc = items;
      if (this.abcd_grid_show) {
        let { id } = this.headerMenu.list[this.selectedIndex()];
        this.abcd_grid_wr = this.commos.grid_body(
          this.selc == 3 ? "GridlistofcontractdetailsAdmin" : "listofpayment",
          true,
          this.headerMenu.list[this.selectedIndex()]["gridwr"]
        );
        this.appliedft = false;
        this.searchstr = "";
      }
    });
  }

  headerMenu = {
    list: [
      {
        gridwr: `?datas=e.no_of_installments='1' and rr.paymentnotifiy=false`,
        name: "payment",
        id: 3,
        index: "1",
      },
      {
        gridwr: `?datas=rr.typeofrequest ilike 'renewal' and rr.status_main=3`,
        name: "renewal",
        id: 6,
        index: "2",
      },
      {
        gridwr: `?datas=rr.typeofrequest ilike 'terminate'`,
        name: "terminal",
        id: 5,
        index: "3",
      },
      {
        gridwr: "?datas=rr.documents is not null and rr.paymentnotifiy=true",
        name: "existing_contract",
        id: 3,
        index: "1",
      },
    ],
    form: [{ name: "contract_page" }],
  };

  closeform() {
    this.abcd_grid_show = true;
    this.rent_rev = false;
  }

  exisitig_grid_data(event): void {
    this.exist_data = undefined;
    this.ajax
      .ajaxget(
        ServerUrl.liveDomain +
          ServerUrl.formsUrl +
          `?name=Gridlistofcontractdetails&primary&where=?datas=rr.rent_request_id=${event["data"]["Rent Request Id"]}`
      )
      .subscribe((res) => {
        let respen = [...res.datavalue][0];
        if (
          respen.hasOwnProperty("contractdocs") ? respen["contractdocs"] : false
        ) {
          let { contractdocs, profile } = respen;
          let constrac = Object.entries(JSON.parse(contractdocs))[0];
          respen["contractdocs"] = Object.entries(constrac[1])[0][1];
          if (profile)
            profile = Object.values(JSON.parse(profile)["profile"])[0];
          respen["profile_pic"] = profile;
        }

        this.exist_data = {
          ...respen,
        };
        // console.log(this.exist_data)
        this.abcd_grid_show = false;
      });
  }

  data_value: any;
  renewal_grid_data(event) {
    this.commos.presentLoader();
    this.ajax
      .ajaxget(
        ServerUrl.liveDomain +
          ServerUrl.formsUrl +
          `?name=AdminDataOfRentRequest&primary&where=?datas=rr.rent_request_id=${event["data"]["rent_request_id"]}`
      )
      .subscribe((res) => {
        let respen = [...res.datavalue][0];
        let { property_image, owner_pic, tenant_pic } = respen;
        let { documents = {"documents" : ""}, proofdoc } = JSON.parse(respen["detailsdoc"]);
        let { installments, rent } = respen;
        rent = Math.floor(
          parseInt(rent) / parseInt(installments.split("mon")[0])
        );
        this.data_value = Object.assign({
          ...res.datavalue[0],
          property_image_manip: property_image[0],
          docs_manipulated: Object.entries(documents)?.[0][1]??"",
          proof_manipulated: Object.entries(proofdoc)[0][1],
          calculatedEmi: rent,
          owner_pic: getProfilePic(owner_pic),
          tenant_pic: getProfilePic(tenant_pic),
        });
        function getProfilePic(pic) {
          return pic ? Object.values(JSON.parse(pic)?.profile ?? [])[0] : null;
        }
        this.abcd_grid_show = false;
        // console.log(this.data_value)
        this.commos.dismissLoader();
      });
  }

  notify() {
    let message;
    let sms;
    if (sessionStorage["language"] == "en") {
      sms = `Dear "${this.data_value.Tenant}", First month payment is received successfullly.`;
      message = `Upload the contract for the Tenant, ${this.data_values.Tenant} `;
    } else {
      sms =
        `لقد تم استلام مبلغ الشهر الأول` +
        `"${this.data_values.Tenant}"` +
        `عزيزي`;
      message = `${this.data_values.Tenant}` + `اضف عقد "اسم العقار`;
    }

    let body = {
      header: {
        name: "paymentNotifi",
        where: "",
        message: message,
        status: "edit",
        primaryvalue: false,
        notification: true,
        rolename: "REFA ADMIN",
      },
      body: {
        property_id: this.data_values["Properties"]["property_id"],
        user_id: this.data_values["users_id"],
        rent_request_id: this.data_values["rent_request_id"],
        paymentnotifiy: true,
      },
    };
    this.commos.presentLoader();
    this.ajax
      .ajaxPut(ServerUrl.liveDomain + ServerUrl.formsUrl, body)
      .subscribe((res) => {
        if (res.reflex) {
        }
        this.abcd_grid_show = true;
        this.abcd_grid_wr = this.commos.grid_body(
          "listofpayment",
          true,
          `?datas= e.no_of_installments='1' and rr.paymentnotifiy=false`
        );
        this.commos.dismissLoader();
      });
  }

  doc_download(url: string, docs: string): void {
    // this.commos.download_doc(url, docs)
    let type = url.split(".")[url.split(".").length - 1];
    if (type.toLowerCase() == "pdf") {
      this.commos.pdf_img_viewer(url, "pdf", docs);
    } else {
      this.commos.pdf_img_viewer(url, "image", docs);
    }
  }

  down_payemnt: string;

  openRejectModal(
    sts_mn: number,
    sts_sb: number,
    data: any,
    status: string,
    rent_rev_val?
  ) {
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
                "Please add comment"
              );
          } catch (error) {
            console.error(error);
          }
        },
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.admin_rent_dec(
            sts_mn,
            sts_sb,
            data,
            status,
            rent_rev_val,
            result.value
          );
        }
      });
  }

  private translate: TranslateService = inject(TranslateService);

  admin_rent_dec(
    sts_mn: number,
    sts_sb: number,
    data: any,
    status: string,
    rent_rev_val?,
    rejectionreason?
  ): void {
    if (this.rent_rev ? !rent_rev_val : false) {
      this.message.add({
        severity: "warn",
        summary: `${this.translate.instant('warning')}`,
        detail: `${this.translate.instant('kindly_fille_down_pyt')}`,
      });
      return null;
    }
    // "Tenant Name" contract renewal request for the property " property address" has been approved.
    let sms;
    if (sessionStorage["language"] == "en") {
      sms =
        status != "rejected"
          ? `Dear "${data.tenant_name}",Your rent now pay later contract renewal request for the [${data.details}] has been approved.`
          : `Dear "${data.tenant_name}",Your rent now pay later contract renewal request for the  [${data.details}] has been rejected.`;
    } else {
      status != "rejected"
        ? `(${data.details})` +
          `لقد تمت الموافقة على تجديد تمويل استأجر الآن وادفع لاحقاً للعقار` +
          `"${data.tenant_name}"` +
          `عزيزي`
        : `(${data.details})` +
          `لقد تم رفض طلب استأجر الآن وادفع لاحقاً المقدم من طرفك لتجدديد العقد للعقار` +
          `"${data.tenant_name}"` +
          `عزيزي`;
    }
    let message =
      `Tenant "${data.tenant_name}"  contract renewal request for the property  "${data.details}" has been` +
      (this.rent_rev
        ? ` revised due to insufficient credit score. Your contract renewal is revised with down payment ${rent_rev_val} SAR`
        : ` ${
            status == "rejected"
              ? `${status} ${
                  rejectionreason ? " due to " + `'${rejectionreason}'` : ""
                }`
              : status.split("#")[this.rent_rev ? 1 : 0]
          }`);

    // let message = `Your property  "property address" rent request has been ${status == 'rejected' ? status : status.split('#')[this.rent_rev ? 1 : 0]} `

    let {
      tenant_id,
      property_id,
      created_on,
      rent_request_id,
      property_owner,
    } = data;
    let data_body = {
      header: {
        name: "rentrequestApprove",
        where: "",
        message: message,
        status: "edit",
        primaryvalue: true,
      },
      body: {
        property_id: property_id,
        user_id: tenant_id,
        rent_request_id: rent_request_id,
        status_sub: sts_sb,
        status_main: sts_mn,
        created_on: created_on,
        paymentnotifiy: false,
        documents: null,
      },
    };
    // if (this.rent_rev) data_body['body']['downpay'] = rent_rev_val;
    this.commos.presentLoader();
    this.ajax
      .ajaxPut(ServerUrl.liveDomain + ServerUrl.formsUrl, data_body)
      .subscribe((res) => {
        if (res.reflex) {
          this.down_payemnt = "";
          this.abcd_grid_wr = this.commos.grid_body(
            "listofpayment",
            true,
            `?datas=rr.typeofrequest ilike 'renewal' and rr.status_main=3`
          );
          if (sts_mn != 5)
            this.property_status_chnage(
              property_owner,
              tenant_id,
              data,
              rent_rev_val
            );
        }
        this.abcd_grid_show = true;
        this.commos.dismissLoader();
      });
  }

  ejarfess: any = {};

  get_ejar_fee(): void {
    this.ajax
      .ajaxget(
        ServerUrl.liveDomain +
          ServerUrl.formsUrl +
          `?name=listoffacilitymaster&primary&where=?facility=eq.paymentFees`
      )
      .subscribe((res) => {
        this.ejarfess = { ...res.datavalue[0] };
      });
  }

  property_status_chnage(
    property_owner: number,
    tenant_id: number,
    data,
    rent_rev_val?
  ): void {
    let { rent_request_id, rent, deposit, installments, property_id } = data;
    installments = parseInt(installments.split("mon")[0]);
    var end_date = this.commos.saudi_time();
    end_date.setDate(end_date.getDate() + 30 * installments);

    var next_payemnt = this.commos.saudi_time();
    next_payemnt.setDate(next_payemnt.getDate());

    let {
      value: {
        refafee: processing_fee,
        agentfee: agent_fee,
        ejar: ejar_fee_amount,
      },
    } = this.ejarfess;
    agent_fee = parseFloat(agent_fee);
    // 'processing_fee': processing_fee,
    // 'ejar_fee_amount': ejar_fee_amount,
    // "agent_fee": Math.floor(parseInt(rent) * (agent_fee / 100)),
    // "deposit_amount": deposit,
    forkJoin([
      this.ajax.ajaxPostWithBody(ServerUrl.liveDomain + ServerUrl.formsUrl, {
        header: {
          name: "AddEmiDetails",
          where: "",
        },
        body: {
          rent_request_id: rent_request_id,
          property_total_rent: rent,
          deposit_amount: 0,
          agent_fee: 0,
          down_payment: rent_rev_val ? rent_rev_val : 0,
          actual_rent: Math.floor(parseInt(rent) / installments),
          startdate: this.commos.saudi_time().toJSON().split("T")[0],
          enddate: end_date.toJSON().split("T")[0],
          next_paymentdate: next_payemnt.toJSON().split("T")[0],
          remaining_amount: rent,
          installments: installments,
          processing_fee: 0,
          ejar_fee_amount: 0,
          user_id: tenant_id,
        },
      }),
      this.ajax.ajaxPut(ServerUrl.liveDomain + ServerUrl.formsUrl, {
        header: {
          name: "propertywidgets",
          where: "",
        },
        body: {
          property_id: property_id,
          property_owner: property_owner,
          status: 6,
        },
      }),
      this.ajax.ajaxPut(ServerUrl.liveDomain + ServerUrl.formsUrl, {
        header: {
          name: "Listofusers",
          where: "",
        },
        body: {
          users_id: tenant_id,
          status: "Tenant",
        },
      }),
    ]).subscribe();
    this.rent_rev = false;
  }

  // serverfilter
  searchstr: string;
  appliedft: Boolean = false;
  gridloader: Boolean = false;
  searchft(data: string) {
    if (!data.trim()) return;
    this.abcd_grid_wr = this.commos.grid_body(
      this.selc == 3 ? "GridlistofcontractdetailsAdmin" : "listofpayment",
      true,
      this.selc == 3
        ? `${
            this.headerMenu.list[this.selectedIndex()]["gridwr"]
          } and (u.username ilike '${data}%25%25' or u.email ilike '${data}%25%25')`
        : `${
            this.headerMenu.list[this.selectedIndex()]["gridwr"]
          } and (u.mobile ilike '${data}%25%25' or u.username ilike '${data}%25%25' or u.location ilike '${data}%25%25')`
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
    let t = this.selectedIndex();
    this.selectedIndex.set(5);
    this.selectedIndex.set(t);
    this.searchstr = "";
    this.appliedft = false;
    this.skeletonDismiss();
  }
}
