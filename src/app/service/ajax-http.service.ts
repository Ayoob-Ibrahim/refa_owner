import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import {
  Observable,
  catchError,
  delay,
  delayWhen,
  fromEvent,
  map,
  of,
  pipe,
  retry,
  tap,
  throwError,
} from "rxjs";
import { Router } from "@angular/router";
import { authservice } from "../auth-guard/auth.service";
import { CommonServiceService } from "./common-service";
import Swal from "sweetalert2";
import { TranslateService } from "@ngx-translate/core";

class newInstance {}
@Injectable({
  providedIn: "root",
})
//
export class AjaxHttpService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private authser: authservice,
    private commonservice: CommonServiceService
  ) {}

  private extractStringData(res: any) {
    const body = res;
    return body || "";
  }

  private httpOptionsWithString(): HttpHeaders {
    const authToken = this.authser.user_token();
    return new HttpHeaders({
      "Access-Control-Allow-Origin": "localhost",
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    });
  }

  private httpOptionsWithJson(): HttpHeaders {
    const authToken = this.authser.user_token();
    return new HttpHeaders({
      "Access-Control-Allow-Origin": "localhost",
      "Content-Type": "application/json;charset=utf-8",
      Authorization: `Bearer ${authToken}`,
    });
  }

  private httpOption4fileUpload(): any {
    const authToken = this.authser.user_token();
    return {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.authser.user_token(),
        "Access-Control-Allow-Origin": "localhost",
      }),
      Authorization: "Bearer " + this.authser.user_token(),
    };
  }

  httpOptionsWithString2: any;
  ajaxPostWithFile2(
    url: string,
    data: any,
    logs?,
    querydt?,
    displayType?,
    navdt?,
    ids?
  ): Observable<any> {
    this.httpOptionsWithString2 = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.authser.user_token(),
        "Access-Control-Allow-Origin": "localhost",
      }),
      Authorization: "Bearer " + this.authser.user_token(),
    };
    const options = this.httpOption4fileUpload();

    return this.http
      .post(url, data, options)
      .pipe(map(this.extractStringData), catchError(this.handleError));
  }

  ajaxPostMethodwithoutToken(url: string, data: any): Observable<any> {
    return this.http
      .post(url, data)
      .pipe(map(this.extractData), catchError(this.handleDeleteError));
  }

  ajaxGetMethodwithoutToken(url: string): Observable<any> {
    return this.http
      .get(url)
      .pipe(map(this.extractData), catchError(this.handleDeleteError));
  }

  isOnline(url: string): Observable<boolean> {
    return this.http.get(url).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  handleDeleteError = async (error: Response) => {
    if (error["error"]["error"] == "Unauthorized") {
    }
    return error;
  };

  private extractData = (res: Response) => {
    const body = res;
    return body || {};
  };

  async toast() {}

  ajaxPut(
    url: string,
    data: any,
    logs?,
    querydt?,
    displayType?,
    navdt?,
    ids?
  ): Observable<any> {
    const headers: HttpHeaders = this.httpOptionsWithString();
    const options = { headers };
    return this.http
      .put(url, data, options)
      .pipe(map(this.extractStringData), catchError(this.handleError));
  }

  ajaxget(url: string): Observable<any> {
    const headers: HttpHeaders = this.httpOptionsWithString();

    const options = { headers };
    return this.http
      .get(url, options)
      .pipe(map(this.extractStringData), catchError(this.handleError));
  }

  ajaxgetNotifiction(url: string): Observable<any> {
    const headers: HttpHeaders = this.httpOptionsWithString();
    const options = { headers };
    const calculateStatusCode = (error: any): any => {
      if (error.status == "401") {
      } else {
      }
      // return console.warn(error, 'M--valuye');
    };

    return this.http.get(url, options).pipe(
      map(this.extractStringData),
      catchError((error) => calculateStatusCode(error))
    );
  }
  ajaxPostWithBody(
    url: string,
    data: any,
    logs?,
    querydt?,
    displayType?,
    navdt?,
    id?
  ): Observable<any> {
    const headers: HttpHeaders = this.httpOptionsWithJson();
    const options = { headers };
    return this.http
      .post(url, data, options)
      .pipe(map(this.extractStringData), catchError(this.handleError));
  }

  ajaxPostWithFile(url: string, data: any): Observable<any> {
    const options = this.httpOption4fileUpload();
    return this.http
      .post(url, data, options)
      .pipe(map(this.extractStringData), catchError(this.handleError));
  }
  ajaxPostWithFileWithouttoken(
    url: string,
    data: any,
    logs?,
    querydt?,
    displayType?,
    navdt?,
    ids?
  ): Observable<any> {
    return this.http
      .post(url, data)
      .pipe(map(this.extractStringData), catchError(this.handleError));
  }

  getImage(url: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      this.http.get(url, { responseType: "blob" }).subscribe({
        next: (blob) => resolve(blob),
        error: (error) => reject(error),
      });
    });
  }

  private GridError(error: HttpErrorResponse) {}

  handleError = async (error: HttpErrorResponse) => {
    let valid = true;
    let erHad = undefined;
    try {
      erHad = JSON.parse(error["error"])["error"];
    } catch (e) {
      valid = false;
    }
    try {
      if (!erHad)
        erHad =
          error["status"] == 401
            ? "Unauthorized"
            : error["status"] == 0
            ? "InternetLost"
            : error["status"] == 500 || error["status"] == 503
            ? "ServerDown"
            : "";
    } catch (e) {
      valid = false;
    }

    if (erHad == "Unauthorized") {
      this.sessionExpired();
    } else if (erHad == "InternetLost") {
      this.NetWorkTester();
    } else if (erHad == "ServerDown") {
      this.serverDownalert();
    }
    // console.log("Orginal Error" + JSON.stringify(error));
    if (error.error instanceof ErrorEvent) {
      // console.error("An error occurred:", error.error.message);
    } else {
      console
        .error
        // `Backend returned code ${error.status}, ` + `body was: ${error.error}`
        ();
    }
    return null;
  };

  private translate: TranslateService = inject(TranslateService);
  sessionExpired() {
    if (this.router.url === "/login") return;
    this.commonservice.dismissLoader();
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-primary",
        // cancelButton: "btn btn-warning",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        html: `
      <div style="padding: 1rem 0 0 0">
        <i style="font-size: 4.2rem; border: 5px solid; border-radius: 50%; padding: 0.5rem 1rem; margin-bottom: 1rem; color: green" class="bi bi-hourglass-bottom "></i>
        <h2 style="margin-top: 1.5rem; margin-bottom: 0.5rem">${this.translate.instant(
          "sessionExpired"
        )} !</h2>
        <p style="margin-bottom: 0; font-weight: 500">${this.translate.instant(
          "sessionExpiredcontent"
        )} !</p>
      </div>
      `,
        width: 500,
        // showCancelButton: true,
        // cancelButtonText: "REFRESH",
        allowOutsideClick: false,
        confirmButtonText: `${this.translate.instant('logout')}`,
      })
      .then((result) => {
        if (result.isDismissed) {
          // this.tokenRestoration();
        } else if (result.isConfirmed) {
          //this.websock.dissociateSocket();
          // localStorage.clear();

          // this.sessionGrid = false;
          // this.websock.dissociateSocket();
          // this.router.navigateByUrl("login");
          this.logOutTerm();
        }
      });
  }

  serverDownalert() {
    this.commonservice.dismissLoader();
    console.log("this.serverDownalert");
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-warning",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        html: `
      <div style="padding: 1rem 0 0 0">
      <i style="font-size: 4.2rem; border: 5px solid; border-radius: 50%; padding: 0.5rem 1rem; margin-bottom: 1rem; color: orange" class="bi bi-cloud-download"></i>
        <h2 style="margin-top: 1.5rem; margin-bottom: 0.5rem">In Progress : Server Down !</h2>
        <p style="margin-bottom: 0; font-weight: 500">Kindly Reload the page for Better Connection</p>
      </div>
      `,
        width: 500,
        showCancelButton: false,
        allowOutsideClick: false,
        confirmButtonText: "RELOAD",
      })
      .then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
  }

  NetWorkTester() {
    this.commonservice.dismissLoader();
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-primary",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        html: `
      <div style="padding: 1rem 0 0 0">
        <i style="font-size: 4.2rem; border: 5px solid; border-radius: 50%; padding: 0.5rem 1rem; margin-bottom: 1rem; color: red" class="bi bi-wifi-off "></i>
        <h2 style="margin-top: 1.5rem; margin-bottom: 0.5rem">No Internet Connection !</h2>
        <p style="margin-bottom: 0; font-weight: 500">Check the internet connection and reload the page</p>
      </div>
      `,
        width: 500,
        showCancelButton: false,
        allowOutsideClick: false,
        confirmButtonText: "Reload",
      })
      .then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
  }

  logOutTerm() {
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigateByUrl("login");
    return;
    //   if(!sessionStorage["sessionCounter"]){
    //     sessionStorage.clear();
    //     localStorage.clear();
    //     this.router.navigateByUrl("login");
    //      return;
    //   };
    //   this.Comserv.presentLoader();
    //   this.ajaxPostMethodwithoutToken(`${ServerUrl.live}/basiclogin/logoff`,{
    //     "id":sessionStorage.sessionCounter
    // }).subscribe((e)=>{

    // },err=>{
    //   sessionStorage.clear();
    //   localStorage.clear();
    //   // storage.storageVariable = "";
    //   // this.websock.dissociateSocket();
    //   this.router.navigateByUrl("login");
    //   this.Comserv.dismissLoader();
    // },()=>{
    //   sessionStorage.clear();
    //   localStorage.clear();
    //   // storage.storageVariable = "";
    //   // this.websock.dissociateSocket();
    //   this.router.navigateByUrl("login");
    //   this.Comserv.dismissLoader();
    // })
    // }
  }

  ///old
}
