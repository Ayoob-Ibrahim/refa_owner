import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit, effect, inject, signal } from "@angular/core";
import { ComponentModule } from "../../modules/component.module";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonServiceService } from "../../service/common-service";
import { AjaxHttpService } from "../../service/ajax-http.service";
import { Subscription, asyncScheduler, forkJoin, map } from "rxjs";
import { ServerUrl } from "../../../environments/environment.prod";
import { MessageService } from "primeng/api";
import { libraryModule } from "../../modules/libraries.modules";
import { FormsModule } from "@angular/forms";
import { DirectivesModuleModule } from "../../modules/directives-module.module";
import Swal from "sweetalert2";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "app-rent-request",
  standalone: true,
  imports: [CommonModule, ComponentModule, libraryModule, FormsModule],
  templateUrl: "./rent-request.component.html",
  styleUrl: "./rent-request.component.scss",
})
export class RentRequestComponent implements OnInit, OnDestroy {
  abcd_grid_wr: any;
  down_payemnt: string;
  rent_rev: Boolean = false;
  headerMenu = {
    list: [
      {
        name: "Rent Requests",
        id: 3,
        index: "1",
        wr: `?datas= r.status_main =3 and r.typeofrequest='newrequest'`,
      },
      {
        name: "approved",
        id: 6,
        index: "2",
        wr: `?datas= (r.status_main=6 or r.status_main=11)`,
      },
      { name: "rejected", id: 5, index: "3", wr: `?datas= r.status_main =5` },
    ],
    form: [{ name: "detailed_information" }],
  };
  abcd_grid_show: boolean = true;
  selectedIndex = signal<number>(0);
  data_value: any;
  GridInfo = {
    quarterGrid: { height: 280, rows: 3, setClass: "racDashboard" },
    halfGrid: { setClass: "racDashboard", height: 330, rows: 10 },
    fullgrid: { setClass: "rac__Dashboard", height: "68vh", rows: 10 },
  };
  ejarfess: any = {};
  direction: string = "en";
  private langBehavior: Subscription;
  paramDT: boolean = false;
  innerGrid_wr;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private commos: CommonServiceService,
    private message: MessageService,
    private ajax: AjaxHttpService
  ) {
    this.effects_signal();
  }
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
        };
      })
    );
    data.subscribe((param) => {
      if (param ? atob(param.data) == "check-subject" : false) {
        this.paramDT = true;
        this.abcd_data_emit({
          data: {
            "Rent Request Id": param.id,
          },
        });
      }
    });
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
  dashbard_subject(): void {
    let data: object = this.commos.dashboard_data_get();
    if (
      data.hasOwnProperty("data")
        ? this.commos.isentry_dash_data(data["data"], "agencies-owner")
        : false
    ) {
    }
  }

  effects_signal() {
    effect(() => {
      const items = this.selectedIndex();
      if (this.abcd_grid_show) {
        this.abcd_grid_wr = this.commos.grid_body(
          "refaadminrentreq",
          true,
          this.headerMenu.list[items]["wr"]
        );
        this.appliedft = false;
        this.searchstr = "";
      }
    });
  }

  abcd_data_emit(event) {
    this.commos.presentLoader();
    this.data_value = undefined;
    this.ajax
      .ajaxget(
        ServerUrl.liveDomain +
          ServerUrl.formsUrl +
          `?name=AdminDataOfRentRequest&primary&where=?datas=rr.rent_request_id=${event["data"]["Rent Request Id"]}`
      )
      .subscribe((res) => {
        let { data } = event;
        this.rent_rev = false;
        let respen = [...res.datavalue][0];
        let { property_image, owner_pic, tenant_pic } = respen;  
        let {  proofdoc,documents = {"documents" : ""} } = JSON.parse(respen["detailsdoc"]);
        let { installments, rent } = respen;
        rent = Math.floor(
          parseInt(rent) / parseInt(installments.split("mon")[0])
        );
        function getProfilePic(pic) {
          return pic ? Object.values(JSON.parse(pic)?.profile ?? [])[0] : null;
        }
        this.data_value = Object.assign({
          ...res.datavalue[0],
          property_image_manip: property_image[0],
          docs_manipulated: Object.entries(documents)?.[0][1]??"",
          proof_manipulated: Object.entries(proofdoc)[0][1] ,
          calculatedEmi: rent,
          owner_pic: getProfilePic(owner_pic),
          tenant_pic: getProfilePic(tenant_pic),
        });
        this.innerGrid_wr = this.commos.grid_body(
          `rentrequest_emi`,
          true,
          `?datas=rr.rent_request_id=${data["Rent Request Id"]}`
        );
        this.commos.dismissLoader();
        console.log(this.data_value);
      });
    this.abcd_grid_show = false;
  }

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
  closeform() {
    // if (this.selectedIndex() == 0) this.abcd_grid_wr = this.grid_body('Listofagencies/owner', true, `?datas=u.status ilike 'Under Review'`)
    // if (this.description_template)
    //   this.description_template = false;
    // else this.abcd_grid_show = true

    if (this.paramDT) {
      this.abcd_grid_wr = this.commos.grid_body(
        "refaadminrentreq",
        true,
        `?datas= r.status_main =3 and r.typeofrequest='newrequest'`
      );
      this.paramDT = false;
    }
    this.rent_rev = false;
    this.abcd_grid_show = true;
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
  private translate: TranslateService = inject(TranslateService);


  openRejectModal(
    sts_mn: number,
    sts_sb: number,
    data: any,
    status: string,
    rent_rev_val?
  ) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: `btn btn-primary btnMarginLeft sweal-btn ${localStorage.getItem('language') === 'en' ? 'font-swt-font-en' : 'font-swt-font-ar'}`,
        cancelButton: `btn btnBgColorWhite sweal-btn ${localStorage.getItem('language') === 'en' ? 'font-swt-font-en' : 'font-swt-font-ar'}`,
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
                `${this.translate.instant('please_add_commentC')}`
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
    let sms;
    if (sessionStorage["language"] == "en") {
      sms =
        status != "rejected"
          ? `Dear "${data.tenant_name}" Your rent now pay later request has been approved. Thank you for choosing REFA.`
          : this.rent_rev
          ? `Dear "Tenant Name" Your rent now pay later request for the [Property Name] has been revised due to insufficient credit score. Your rent now now pay later request is revised with down payment.`
          : `Dear "${data.tenant_name}" Thank you for your interest in [${data.details}].Unfortunately, your rent now pay later request has been REJECTED.`;
    } else {
      sms =
        status != "rejected"
          ? `لقد تمت الموافقة على طلب استأجر الآن وادفع لاحقاً. شكراً لاختيارك ريفا،` +
            `"${data.tenant_name}"` +
            `عزيزي ا`
          : this.rent_rev
          ? `نعتذر عن قبول طلبك ونشكرك لاختيارك ريفا.` +
            `"${data.tenant_name}"` +
            `عزيزي ا`
          : `وبناء على تقرير سجلك الأتماني لابد من دفع دفعة مقدمة.` +
            `(${data.details})` +
            `لقد تمت مراجعة طلبك لاستجار` +
            `"${data.tenant_name}"` +
            `عزيزي ا`;
    }

    let message =
      `"${data.tenant_name}",Your rent request for the property "${data.details}" has been` +
      (this.rent_rev
        ? ` revised due to insufficient credit score. Your rent request is revised with down payment ${rent_rev_val} SAR`
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
        sms: sms,
        status: "edit",
        primaryvalue: true,
        notification: true,
        rolename: "REFA ADMIN",
      },
      body: {
        property_id: property_id,
        user_id: tenant_id,
        rent_request_id: rent_request_id,
        status_sub: sts_sb,
        status_main: sts_mn,
        created_on: created_on,
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
            "refaadminrentreq",
            true,
            `?datas= r.status_main =3 and r.typeofrequest='newrequest'`
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

    forkJoin([
      this.ajax.ajaxPostWithBody(ServerUrl.liveDomain + ServerUrl.formsUrl, {
        header: {
          name: "AddEmiDetails",
          where: "",
        },
        body: {
          rent_request_id: rent_request_id,
          property_total_rent: rent,
          deposit_amount: Math.floor(deposit).toFixed(2),
          agent_fee: Math.floor(parseInt(rent) * (agent_fee / 100)).toFixed(2),
          down_payment: rent_rev_val
            ? Math.floor(rent_rev_val).toFixed(2)
            : 0.0,
          // actual_rent: Math.floor(
          //   parseInt(rent_rev_val ? rent - rent_rev_val : rent) / installments
          // ),
          actual_rent: (
            Math.floor(
              ((rent_rev_val ? rent - rent_rev_val : rent) / installments) * 100
            ) / 100
          ).toFixed(2),
          // (Math.floor((50000 / 12) * 100) / 100).toFixed(2)
          startdate: this.commos.saudi_time().toJSON().split("T")[0],
          enddate: end_date.toJSON().split("T")[0],
          next_paymentdate: next_payemnt.toJSON().split("T")[0],
          remaining_amount: rent,
          installments: installments,
          processing_fee: Math.floor(processing_fee).toFixed(2),
          ejar_fee_amount: Math.floor(ejar_fee_amount).toFixed(2),
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
          name: "usersStatusChange",
          where: "",
        },
        body: {
          users_id: tenant_id,
          status: "Tenant",
        },
      }),
    ]).subscribe();
  }

  rent_revision(): void {}

  // serverfilter
  searchstr: string;
  appliedft: Boolean = false;
  gridloader: Boolean = false;
  searchft(data: string) {
    if (!data.trim()) return;
    let { id } = this.headerMenu.list[this.selectedIndex()];
    this.abcd_grid_wr = this.commos.grid_body(
      `refaadminrentreq`,
      true,
      `${
        this.headerMenu.list[this.selectedIndex()]["wr"]
      }  and (p.property_name ilike '${data}%25%25' or u.username ilike '${data}%25%25' or p.city ilike '${data}%25%25')`
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
