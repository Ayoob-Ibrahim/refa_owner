import { Component, OnDestroy, OnInit, Renderer2, inject } from "@angular/core";
import { Router } from "@angular/router";
import { CommonServiceService } from "../../service/common-service";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";

interface routeInfo {
  name: string;
  path: string;
  child: boolean;
  icon: string;
}

const list_of_menu: routeInfo[] = [
  {
    name: "Dashboard",
    path: "/dashboard",
    child: false,
    icon: "Dashboard",
  },
  {
    name: "Properties",
    path: "/property-approval",
    child: false,
    icon: "Properties",
  },
  {
    name: "Tenants",
    path: "/tenant",
    child: false,
    icon: "Tenants",
  },
  {
    name: "Agencies/Owner",
    path: "/agencies-owner",
    child: false,
    icon: "Agencies owners",
  },
  {
    name: "Rent Requests",
    path: "/rent-request",
    child: false,
    icon: "Rent Request",
  },
  // {
  //   name: 'Financial assessment',
  //   path: '/test',
  //   child: false,
  // icon: "Financial assessment"
  // },
  {
    name: "Contract",
    path: "/contract",
    child: false,
    icon: "Contract",
  },
  {
    name: "Settings",
    path: "/setting",
    child: false,
    icon: "Settings",
  },
  {
    name: "Users",
    path: "/test",
    child: false,
    icon: "Users",
  },
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.scss",
})
export class SidebarComponent implements OnInit, OnDestroy {
  menuList = [];
  cur_lang: string = sessionStorage["language"];
  username = sessionStorage["name"];
  constructor(
    private router: Router,
    private commons: CommonServiceService,
    private renderer: Renderer2
  ) {}
  // navigate(path) {

  // }
  ngOnDestroy(): void {
    if (this.langBehavior) {
      this.langBehavior.unsubscribe();
    }
  }
  ngOnInit(): void {
    this.languageGetter();
    this.menulist();
  }

  private langBehavior: Subscription;
  direction: string = "en";
  languageGetter(): void {
    this.langBehavior = this.commons.languagetter().subscribe((data) => {
      this.direction = data;
    });
  }
  menulist() {
    let list_menu = [...list_of_menu];
    let sessionMenu = JSON.parse(sessionStorage["menu"]);
    list_menu.map((value) => {
      if (sessionMenu.includes(value.name)) {
        this.menuList.push(value);
      }
    });
  }

  expand() {
    this.isExpand = !this.isExpand;
  }
  isExpand = true;

  navigatePage(path: any) {
    if (this.router.url == path)
      this.router
        .navigateByUrl("/refresh", { skipLocationChange: true })
        .then(() => {
          this.router.navigate([path]);
        });
    // this.router.navigateByUrl(urlData);
  }

  Logout() {
    this.commons.logout();
  }

  private trasnServ: TranslateService = inject(TranslateService);

  languagecontrol() {
    sessionStorage["language"] =
      sessionStorage["language"] == "ar" ? "en" : "ar";
    this.cur_lang = sessionStorage["language"];
    this.trasnServ.use(sessionStorage["language"]);
    this.languageInitializer();
  }

  languageInitializer() {
    this.commons.languageInitilazation(this.renderer);
    this.commons.languagesetter();
  }
}
