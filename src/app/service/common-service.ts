import { DOCUMENT } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { inject, Inject, Injectable, Renderer2 } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import Swal from "sweetalert2";
import { PdfImgComponent } from "../components/pdf-img/pdf-img.component";
import { TranslateService } from "@ngx-translate/core";

interface loginData {
  token: string;
  menu: string;
}

@Injectable({
  providedIn: "root",
})
export class CommonServiceService {
  constructor(
    @Inject(DOCUMENT) private document: HTMLDocument,
    private http: HttpClient,
    private route: Router
  ) {}
  private dashboard_data: any;
  presentLoader() {
    this.document.getElementById("loader").classList.remove("loaders");
    this.document.getElementById("loader").classList.add("loadersEnable");
  }
  dismissLoader() {
    this.document.getElementById("loader").classList.remove("loadersEnable");
    this.document.getElementById("loader").classList.add("loaders");
  }

  set_session(response: loginData) {
    sessionStorage.setItem("login", "true");
    sessionStorage.setItem("token", response["token"]);
    sessionStorage.setItem("menu", response["menu"]);
    sessionStorage.setItem("role", response["role"]);
    sessionStorage.setItem("userid", response["userid"]);
    sessionStorage.setItem("name", response["name"]);
    sessionStorage.setItem("status", response["status"]);
    // sessionStorage.setItem("language", "en");
  }

  isentry_dash_data(value: object, pathurl: string): Boolean {
    let isentry: Boolean = value["Page URL"] == pathurl;
    return isentry;
  }

  dashboard_data_set(data: object): void {
    this.dashboard_data = data;
  }

  dashboard_data_get(): object {
    return this.dashboard_data;
  }

  satelliteLayer = true;
  changeMapLayer() {
    this.satelliteLayer = !this.satelliteLayer;
  }

  getMapLayer() {
    return this.satelliteLayer ? "s&hl=en" : "m";
  }

  grid_body(grid_name: string, func: Boolean, where: string): Object {
    return {
      callback: "",
      value: {
        Data: [
          {
            Where: where,
            Name: grid_name,
          },
        ],
      },
      mode: "",
      function: func,
    };
  }

  saudi_time() {
    var currentTime = new Date();
    var utcTime = currentTime.getTime();
    var saudiTimeOffset = 3 * 60 * 60 * 1000;
    return new Date(utcTime + saudiTimeOffset);
  }

  download_doc(url: string, doc: string) {
    this.http.get(url, { responseType: "blob" }).subscribe((blob) => {
      const downloadLink = document.createElement("a");
      downloadLink.href = window.URL.createObjectURL(blob);
      downloadLink.download = doc;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    });
  }
  private translate: TranslateService = inject(TranslateService);

  logout() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: `btn-custom-logout confirm-logout ${localStorage.getItem('language') === 'en' ? 'font-swt-font-en' : 'font-swt-font-ar'}`, //btnMarginLeft added in styles.scss
        cancelButton: `btn-custom-logout ${localStorage.getItem('language') === 'en' ? 'font-swt-font-en' : 'font-swt-font-ar'}`

      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        html: `
      <div style="padding: 1rem 0 0 0">
        <i style="font-size: 4.2rem; border: 5px solid; border-radius: 50%; padding: 0.2rem 0.4rem 0 0.9rem; margin-bottom: 1rem" class="bi bi-box-arrow-right"></i>
        <h2 style="margin-top: 1rem; margin-bottom: 0.5rem;font-family:janna-bold">${this.translate.instant(
          "logoutcontent1"
        )}</h2>
        <p style="margin-bottom: 0; font-weight: 500;font-family:janna-bold">${this.translate.instant(
          "logoutcontent2"
        )}</p>
      </div>
      `,
        // icon: 'warning',
        showCancelButton: true,
        confirmButtonText: `${this.translate.instant('logout')}`,
        cancelButtonText: `${this.translate.instant('cancel')}`,
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          sessionStorage.clear();
          localStorage.clear();
          this.route.navigateByUrl("login");
          this.dismissLoader();
        }
      });
  }

  languageInitilazation(renderer: Renderer2): void {
    let dir = sessionStorage["language"];
    let body = document.getElementsByTagName("body")[0];
    // let jqxHeader = document.getElementsByClassName(".jqx-grid-cell");

    renderer.setAttribute(body, "dir", dir == "ar" ? "rtl" : "ltr");
    // renderer.setAttribute(jqxHeader, "font-family", "Monstrate");
  }

  private updateLanguageDir = new BehaviorSubject("");

  languagetter() {
    return this.updateLanguageDir.asObservable();
  }

  languagesetter(): void {
    this.updateLanguageDir.next(sessionStorage.getItem("language"));
  }

  widgetsDataManipulation(datarepsonse) {
    let widgetsCount = JSON.parse(datarepsonse.jqxdetails)[
      JSON.parse(datarepsonse.jqxdetails)["widgetDetail"]
    ];
    for (let i = 0; i < widgetsCount.length; i++) {
      widgetsCount[i]["count"] = JSON.parse(datarepsonse.datavalue)[0][
        widgetsCount[i]["widgetname"]
      ];
    }
    return widgetsCount;
  }

  public dialog: MatDialog = inject(MatDialog);

  pdf_img_viewer(url: string, type: string, docName: string) {
    const dialogRef = this.dialog.open(PdfImgComponent, {
      disableClose: true,
      width: "800px",
      height: "85vh",
      panelClass: "custom-container",
      data: {
        url: url,
        type: type,
        docName: docName,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  imageView(imgAr, index) {
    const dialogRef = this.dialog.open(PdfImgComponent, {
      disableClose: true,
      width: "800px",
      height: "85vh",
      panelClass: "custom-container",
      data: {
        imagearr: imgAr,
        selectedone: index,
        type: "image_array",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
