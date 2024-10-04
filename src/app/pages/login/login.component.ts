import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  Renderer2,
} from "@angular/core";
import { ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { AjaxHttpService } from "../../service/ajax-http.service";
import { ServerUrl } from "../../../environments/environment.prod";
import { CommonServiceService } from "../../service/common-service";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { MessageService } from "primeng/api";
import { libraryModule } from "../../modules/libraries.modules";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";
import { ComponentModule } from "../../modules/component.module";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, libraryModule, ComponentModule],
})
export class LoginComponent implements OnInit, AfterViewInit {
  constructor(
    private route: Router,
    private formBuilder: FormBuilder,
    private ajax: AjaxHttpService,
    public coms: CommonServiceService,
    private message: MessageService,
    private renderer: Renderer2
  ) {}

  private trasnServ: TranslateService = inject(TranslateService);
  ngAfterViewInit(): void {
    this.remeber_password();
  }
  ngOnInit(): void {
    if (
      sessionStorage["language"] != "" ||
      sessionStorage["language"] != null
    ) {
      this.cur_lang = "en";
      sessionStorage["language"] = "en";
      this.trasnServ.use(sessionStorage["language"]);
    } else {
      this.languageInitializer();
      this.languageGetter();
    }
  }
  private langBehavior: Subscription;

  languageGetter(): void {
    this.langBehavior = this.coms.languagetter().subscribe((data) => {
      if (data != null) {
        this.cur_lang = data;
      }
    });
  }
  cur_lang: string = "en";
  loginForm = this.formBuilder.group({
    username: ["", Validators.required],
    password: ["", Validators.required],
    checkuser: "Refa Admin",
    rememberme: [false],
  });
  languageInitializer() {
    this.coms.languageInitilazation(this.renderer);
    this.coms.languagesetter();
  }
  languagecontrol() {
    sessionStorage["language"] =
      sessionStorage["language"] == "ar" ? "en" : "ar";
    this.cur_lang = sessionStorage["language"];
    this.trasnServ.use(sessionStorage["language"]);
    this.languageInitializer();
  }
  submit_log_data() {
    this.coms.presentLoader();
    const loginData = { ...this.loginForm.value };
    if (loginData.hasOwnProperty("rememberme")) delete loginData["rememberme"];
    this.ajax
      .ajaxPostMethodwithoutToken(
        `${ServerUrl.liveDomain}/login/userlogin`,
        loginData
      )
      .subscribe((res) => {
        this.remeber_password(true);
        if (res.token) {
          this.coms.set_session(res);
          this.route.navigateByUrl("/dashboard");
        } else if (res.error) {
          this.message.add({
            severity: "warn",
            summary: `${this.translate.instant('warning')}`,
            detail: res.error,
          });
        }
        this.coms.dismissLoader();
      });
  }

  private translate: TranslateService = inject(TranslateService);

  remeber_password(login?) {
    if (login) {
      let rememberMeClicked = this.loginForm.get("rememberme").value;
      if (rememberMeClicked) {
        document.cookie = `usrname=${this.loginForm.value.username.trim()};path=${
          window.location.href
        }`;
        // document.cookie = `usrpswd=${this.loginForm.value.password.trim()};path=${window.location.href}`;
        document.cookie = `rememberLogin=true;path=${window.location.href}`;
      } else if (!rememberMeClicked) {
        document.cookie.split(";").forEach(function (c) {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(
              /=.*/,
              "=;expires=" + new Date().toUTCString() + ";path=/"
            );
        });
      }
    } else {
      setTimeout(() => {
        let usrname = this.getCookie("usrname");
        let usrpswd = this.getCookie("usrpswd");
        let rememberLogin = this.getCookie("rememberLogin");
        this.loginForm.get("username").patchValue(usrname);
        this.loginForm.get("password").patchValue(usrpswd);
        this.loginForm.get("rememberme").patchValue(Boolean(rememberLogin));
      }, 100);
    }
  }

  getCookie(cname) {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split("; ");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == "  ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  isVisible: boolean = false;

  toggleVisibiltiy() {
    this.isVisible = !this.isVisible;
  }
}
