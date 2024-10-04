import { CommonModule } from "@angular/common";
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  effect,
  inject,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonServiceService } from "../../service/common-service";
import { MessageService } from "primeng/api";
import { AjaxHttpService } from "../../service/ajax-http.service";
import { ServerUrl } from "../../../environments/environment.prod";
import { ComponentModule } from "../../modules/component.module";
import { forkJoin, Subscription } from "rxjs";
import { PasswordVerificationDirective } from "../../directives/password-verification.directive";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { PopupforcategoryComponent } from "../../components/popupforcategory/popupforcategory.component";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "app-settings",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ComponentModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: "./settings.component.html",
  styleUrl: "./settings.component.scss",
  // encapsulation: ViewEncapsulation.ShadowDom
})
export class SettingsComponent implements OnInit, OnDestroy {
  @ViewChild("form_parent_") form_parent_ref: ElementRef;
  headerMenu = {
    list: [
      { name: "profile", id: 3, index: "1" },
      { name: "management", id: 6, index: "2" },

      // { name: 'NOTIFICATION', id: 6, index: '2' },
    ],
    submenu: [
      { name: "payment", index: "1" },
      { name: "property", index: "2" },
    ],
  };
  isEdit: Boolean = true;
  ejarfess: any = {};
  ejarfessdata: any = {};
  form_data: any = {};
  temp_data: any = {};
  isPayment: Boolean = true;
  selectedIndex = signal<number>(0);
  selectedSubIndex = signal<number>(0);
  ispassword: Boolean = true;
  private translate: TranslateService = inject(TranslateService);
  dataPref = {
    notification: true,
    warning: "",
    recentcomments: "",
    activitylogs: "",
  };
  treeData = {};

  deleteNode(node, parentNode: any): void {
    if (parentNode) {
      // Find index of the node to be deleted
      const index = parentNode.children?.indexOf(node);
      if (index !== undefined && index > -1) {
        parentNode.children?.splice(index, 1); // Remove the node from the parent's children array
      }
    } else {
      // If no parentNode, this is the root node, handle accordingly
      console.error("Cannot delete root node");
    }
  }

  // Function to handle the click event
  onDeleteClick(node, parentNode: null): void {
    if (this.editCat) this.deleteNode(node, parentNode);
  }
  direction: string = "en";
  private langBehavior: Subscription;
  editCat = false;

  editCategory() {
    this.editCat = !this.editCat;
  }

  content_notification = [
    {
      selection: "day",
      title: "E-Mail Preferences",
      content:
        "Select how frequently you wish Received the Notification. Receive quick notification or a summary of all notifications once a day or week.",
    },
    {
      selection: "week",
      title: "Notifications",
      content:
        "Notification of new features, and notification of system upgrades",
    },
    {
      selection: "instant",
      title: "Rent requests",
      content: "Would you prefer to receive notifications daily or weekly?",
    },
    {
      selection: "week",
      title: "Newly added properties",
      content:
        "To receive notifications for newly added properties and their details, please select your preferred notification frequency: daily or weekly.",
    },
    {
      selection: "day",
      title: "Activity Logs",
      content:
        "Notification on the change of status for penalties, milestones and defect fleet",
    },
  ];

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private commos: CommonServiceService,
    private message: MessageService,
    private ajax: AjaxHttpService
  ) {
    this.effects_signal();
  }
  ngOnDestroy(): void {
    if (this.langBehavior) {
      this.langBehavior.unsubscribe();
    }
  }
  ngOnInit(): void {
    this.languageGetter();
  }
  list_countreis: any;
  list_cites: any;
  list_province: any;
  get_list_of_countries(): Promise<any> {
    const countryPromise = this.ajax
      .ajaxget(
        ServerUrl.liveDomain +
          ServerUrl.formsUrl +
          `?name=listofcountries&primary&where=?country_id=eq.1`
      )
      .toPromise();

    const provincePromise = this.ajax
      .ajaxget(
        ServerUrl.liveDomain +
          ServerUrl.formsUrl +
          `?name=listofprovinces&primary&where=?country_id=eq.1`
      )
      .toPromise();

    return Promise.all([countryPromise, provincePromise])
      .then(([country, province]) => {
        this.list_countreis = [...country.datavalue];
        this.list_countreis.forEach(element => {
          element["country_name"] = JSON.parse(element["country_name"]);
        });

        this.list_province = [...province.datavalue];
        this.list_province.forEach(element => {
          element["province_name"] = JSON.parse(element["province_name"]);
        });
        var provinceid = this.list_province.filter(
          (data) => (data.province_name["en"] == this.form_data.province)||(data.province_name["Ar"] == this.form_data.province)
        );
        
        

        this.form_data.province = this.form_data.province;
        // this.form_data.province = this.form_data.province;
        
        this.getCity(provinceid[0].province_id);
      })
      .catch((error) => {
        return Promise.reject(error); // Ensure the error is propagated
      });
  }
  filterCity(data) {
    var provinceid = this.list_province.filter(
      (data) => (data.province_name["en"] == this.form_data.province)||(data.province_name["Ar"] == this.form_data.province)
    );
    this.getCity(provinceid[0].province_id);
    console.log(data, ">>>>>>>>>");
  }

  getCity(provinceid) {
    console.log(provinceid);
    
    this.commos.presentLoader();
    console.log(this.form_data.province);
    this.ajax
      .ajaxget(
        ServerUrl.liveDomain +
          ServerUrl.formsUrl +
          `?name=listofcities&primary&where=?province_id=eq.${provinceid}`
      )
      .subscribe((res) => {
        this.commos.dismissLoader();
        this.list_cites = [...res.datavalue];
        this.list_cites.forEach(element => {
          element["city_name"]=JSON.parse(element["city_name"])
        });
      });
  }

  languageGetter(): void {
    this.langBehavior = this.commos.languagetter().subscribe((data) => {
      this.direction = data;
    });
  }

  effects_signal() {
    effect(() => {
      const items = this.selectedIndex();
      if (items == 0) {
        this.get_admin_();
      }
      if (items == 1) this.selectedSubIndex.set(0);
      // else if (items == 1) this.get_ejar_fee();
    });
    effect(() => {
      if (this.selectedSubIndex() == 0) this.get_ejar_fee();
      if (this.selectedSubIndex() == 1) this.getCatData();
    });
  }

  cancelCat() {
    this.editCat = !this.editCat;
    this.getCatData();
  }
  saveCat() {
    this.commos.presentLoader();
    this.ajax
      .ajaxPut(ServerUrl.liveDomain + ServerUrl.formsUrl, {
        header: {
          name: "listoffacilitymaster",
          where: "",
        },
        body: {
          facility_id: this.treeData["facility_id"],
          facility: "Property_Category",
          value: this.treeData["value"],
        },
      })
      .subscribe((res) => {
        if (res.reflex) {
          this.getCatData();
          this.editCat = !this.editCat;
        }
        this.commos.dismissLoader();
      });
  }
  getCatData() {
    this.commos.presentLoader();
    this.ajax
      .ajaxget(
        ServerUrl.liveDomain +
          ServerUrl.formsUrl +
          `?name=listoffacilitymaster&primary&where=?select=value,facility_id%26facility=eq.Property_Category`
      )
      .subscribe((res) => {
        this.commos.dismissLoader();
        console.log(res);
        this.treeData = res.datavalue[0];
        console.log(this.ejarfessdata);
      });
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
        let {
          value: { agentfee, ejar, refafee },
        }: any = { ...res.datavalue[0] };
        Object.assign(this.ejarfessdata, {
          value: {
            agentfee: agentfee + " %",
            ejar: ejar + " SAR",
            refafee: refafee + " SAR",
          },
        });
        // console.log(this.ejarfessdata)
      });
  }

  get_admin_(): void {
    this.form_data = {};
    this.temp_data = {};
    this.list_cites = [];
    this.list_countreis = [];
    this.list_province = [];
    this.ispassword = true;
    this.isEdit = true;
    this.commos.presentLoader();
    this.ajax
      .ajaxget(
        ServerUrl.liveDomain +
          ServerUrl.formsUrl +
          `?name=Listofagencies/owner&primary&where=?datas=u.users_id=${sessionStorage["userid"]}%26admin=true`
      )
      .subscribe((res) => {
        this.form_data = { ...res.datavalue[0] };
        this.temp_data = { ...res.datavalue[0] };
        this.commos.dismissLoader();
        this.form_data.updated_on = this.form_data.updated_on.substring(0, 10);
        this.get_list_of_countries();
      });
  }

  enablng_edit(edit_data: string, btn_id: string) {
    this[edit_data] = !this[edit_data];
    if (!this[edit_data])
      setTimeout(() => {
        document.getElementById(btn_id).scrollIntoView({ behavior: "smooth" });
      }, 200);
    if (edit_data == "isEdit" && this[edit_data]) {
      this.form_data = { ...this.temp_data };
    }
  }

  getpaymentview(data: string): string {
    return this.isPayment
      ? this.ejarfessdata["value"][data]
      : this.ejarfess["value"][data];
  }
  setpaymentvalue(value: string, type: string): void {
    if (this.isPayment) {
      this.ejarfessdata["value"][type] = value;
    } else {
      this.ejarfess["value"][type] = value;
    }
  }

  save_ejar_fee(data: Object) {
    // console.log(data)
    let { facility_id, facility, value }: any = data;
    console.log(Object.values(value));
    Object.values(value).map((value) => {
      if (!value) {
        this.message.add({
          severity: "error",
          summary: `${this.translate.instant('mandatory')}`,
          detail: `${this.translate.instant('fill_all_feilds')}`,
        });
        return null;
      }
    });
    this.commos.presentLoader();
    this.ajax
      .ajaxPut(ServerUrl.liveDomain + ServerUrl.formsUrl, {
        header: {
          name: "listoffacilitymaster",
          where: "",
        },
        body: {
          facility_id: facility_id,
          facility: facility,
          value: value,
        },
      })
      .subscribe((res) => {
        if (res.reflex) {
          this.get_ejar_fee();
          this.isPayment = true;
        }
        this.commos.dismissLoader();
      });
  }
  @ViewChild(PasswordVerificationDirective)
  $password: PasswordVerificationDirective;
  applychanges() {
    let success: boolean = true;
    let passwordsave: boolean = false;
    const inputElements =
      this.form_parent_ref.nativeElement.querySelectorAll("input");
    inputElements.forEach((child: any) => {
      if (child.classList.contains("border-invalid")) {
        child.focus();
        child.blur();
        success = false;
      }
    });
    if (!success) return;
    // && this.ispassword && this.$password.ispassword
    if (
      !this.ispassword &&
      (!this.form_data.c_password || !this.form_data.password)
    ) {
      this.message.add({
        severity: "info",
        summary: `${this.translate.instant('invalid')}`,
        detail: `${this.translate.instant('pass_empty_msg')}`,
      });
      return;
    }

    if (!this.ispassword ? !this.$password.ispassword : false) {
      this.message.add({
        severity: "info",
        summary: `${this.translate.instant('invalid')}`,
        detail: `${this.translate.instant('password_case_msg')}`,
      });
      return;
    } else if (this.form_data.c_password != this.form_data.password) {
      this.message.add({
        severity: "info",
        summary: `${this.translate.instant('invalid')}`,
        detail: `${this.translate.instant('password_same_msg')}`,
      });
      return;
    } else passwordsave = true;

    let passwordapibody = {
      header: {
        name: "Listofusers",
        where: "",
      },
      body: {
        users_id: sessionStorage["userid"],
        username: sessionStorage["name"],
        status: sessionStorage["status"],
        mobile: this.form_data.mobile,
        email: this.form_data.email,
      },
    };

    if (passwordsave) {
      passwordapibody["body"]["user_password"] = this.form_data.password;
    }

    let ajaxfirstcall = this.apicall(passwordapibody);

    let ajaxsecondcall = this.apicall({
      header: {
        name: "Userdetails",
        where: "",
      },
      body: {
        users_id: sessionStorage["userid"],
        users_detail_id: this.form_data.users_detail_id,
        line1: this.form_data.line1,
        line2: this.form_data.line2,
        building: this.form_data.building,
        city: this.form_data.city_name,
        province: this.form_data.province,
        country: this.form_data.country_name,
        pcode: this.form_data.pcode,
      },
    });

    this.commos.presentLoader();
    forkJoin([ajaxfirstcall, ajaxsecondcall]).subscribe({
      next: (res) => {
        this.temp_data = {};
        this.message.add({
          severity: "success",
          summary: `${this.translate.instant('succ')}`,
          detail: `${this.translate.instant('changes_saved_succ')}`,
        });
        this.get_admin_();
        this.commos.dismissLoader();
      },
    });
  }

  apicall = (body: Object) => {
    return this.ajax.ajaxPut(ServerUrl.liveDomain + ServerUrl.formsUrl, body);
  };

  dynamicName = "World";
  showTemplate = true;

  changeName() {
    this.dynamicName = "Angular";
  }

  addCat(index: number, parentName: string): void {
    if (this.editCat) {
      const dialogRef = this.dialog.open(PopupforcategoryComponent);

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.addNode(
            result,
            this.findNodeByName(this.treeData["value"], parentName)
          );
        }
      });
    }
  }

  private findNodeByName(node: any, name: string): any | null {
    if (node.name === name) {
      return node;
    }
    if (node.children) {
      for (const child of node.children) {
        const found = this.findNodeByName(child, name);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  private addNode(name: string, parentNode: any): void {
    if (parentNode) {
      if (!parentNode.children) {
        parentNode.children = [];
      }
      parentNode.children.push({ name });
    } else {
      console.error("Parent node not found");
    }
  }
}
