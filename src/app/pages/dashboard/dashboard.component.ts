import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { ServerUrl } from "../../../environments/environment.prod";
import { AjaxHttpService } from "../../service/ajax-http.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonServiceService } from "../../service/common-service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-dashboard",

  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.scss",
})
export class DashboardComponent implements OnInit, OnDestroy {
  selectedIndex: number = 0;
  headerMenu = [{ name: "overview" }];
  direction: string = "en";
  private langBehavior: Subscription;
  GridInfo = {
    quarterGrid: { height: "290px", rows: 3, setClass: "racDashboard" },
    halfGrid: { setClass: "racDashboard", height: 330, rows: 10 },
  };

  list = [];

  action_grid_wr: any;

  constructor(
    private ajax: AjaxHttpService,
    private router: Router,
    private route: ActivatedRoute,
    private commos: CommonServiceService
  ) {}
  ngOnInit(): void {
    this.grid_get();
    this.get_widget();
    this.languageGetter();
    this.get_admin_noti();
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

  get_widget() {
    this.ajax
      .ajaxPostWithBody(ServerUrl.liveDomain + ServerUrl.widgetsUrl, {
        header: {
          Name: "dashboardtotaldataofrefaadmin",
          function: true,
          where: "",
        },
      })
      .subscribe((res) => {
        let { jqxdetails, datavalue } = res;
        jqxdetails = JSON.parse(jqxdetails);
        datavalue = JSON.parse(datavalue);
        jqxdetails.singlecardwidgets.map((value) => {
          value["count"] = datavalue[0][value.widgetname];
        });
        this.list = [...jqxdetails.singlecardwidgets];
        console.log(this.list);
      });
  }
  filterFont(i) {
    if (i == 0 || i == 2) {
      return true;
    } else {
      return false;
    }
  }
  grid_get(): void {
    this.action_grid_wr = this.commos.grid_body(`Listofactionitems`, true, ``);
  }

  abcd_data_emit(event) {
    let {
      data: {
        "Page URL": page_url,
        ID: stringurl,
        "Primary Id": primaryID,
        "Alias name": aliasName,
      },
    } = event;
    this.router.navigate([page_url], {
      skipLocationChange: true,
      queryParams: {
        data: btoa("check-subject"),
        id: btoa(stringurl),
        primary: primaryID,
        tabtype: 1,
        aliasName: aliasName,
      },
    });
  }

  get_admin_noti(): void {
    this.ajax
      .ajaxget(
        ServerUrl.liveDomain +
          ServerUrl.formsUrl +
          `?name=getnotification&primary&where=?datas=createdby!='REFA ADMIN'`
      )
      .subscribe((res) => {
        this.notifiction = res["datavalue"];
      });
  }

  //test
  notifiction = [
    // "Contra   Al Murabba, Riyadh 12613.",
    // "Your rent request for the property “4BHK Gated community, Al Khalij.” 99 King Faisal Road, Al Khalij, Riyadh 12613, has been approved. ",
    // "Your Property approval for the property “2BHK, Al Zahraa.” has been rejected.",
    // "Your Property approval for the property “2BHK, Al Zahraa.” has been rejected.Your Property approval for the property “2BHK, Al Zahraa.” has been rejected.Your Property approval for the property “2BHK, Al Zahraa.” has been rejected.Your Property approval for the property “2BHK, Al Zahraa.” has been rejected.” has been rejected.Your Property approval for the property “2BHK, Al Zahraa.” has been rejected.Your Property approval for the property “2BHK, Al Zahraa.” has been rejected.” has been rejected.Your Property approval for the property “2BHK, Al Zahraa.” has been rejected.Your Property approval for the property “2BHK, Al Zahraa.” has been rejected.” has been rejected.Your Property approval for the property “2BHK, Al Zahraa.” has been rejected.Your Property approval for the property “2BHK, Al Zahraa.” has been rejected.” has been rejected.Your Property approval for the property “2BHK, Al Zahraa.” has been rejected.Your Property approval for the property “2BHK, Al Zahraa.” has been rejected.",
    // "Your rent request for the property “5BHK Apartment, Al Khalij.” 99 King Faisal Road, Al Khalij, Riyadh 12613, has been approved. ",
    // "Contract has been issued for the property “2BHK Apartment, Al Murabba.” 6359 King Faisal Road, Al Murabba, Riyadh 12613.",
    // "Contract has been issued for the property “3BHK Villa, Al Murabba.” 6359 King Faisal Road, Al Murabba, Riyadh 12613.",
    // "Your rent request for the property “4BHK Gated community, Al Khalij.” 99 King Faisal Road, Al Khalij, Riyadh 12613, has been approved. ",
  ];
}
