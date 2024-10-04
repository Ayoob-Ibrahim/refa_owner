import { HttpClient } from "@angular/common/http";
import {
  AfterViewInit,
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { jqxGridComponent } from "jqwidgets-ng/jqxgrid";
import { AjaxHttpService } from "../../service/ajax-http.service";
import { ServerUrl } from "../../../environments/environment.prod";
import { CommonServiceService } from "../../service/common-service";
import { Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-dc-component",
  templateUrl: "./dc-component.component.html",
  styleUrls: ["./dc-component.component.scss"],
})
export class DcComponentComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() companyName: string;
  @Output() abcd_data_emit = new EventEmitter();
  @Output() numberOfData = new EventEmitter(); //*mark32
  @Input() whereCondition;
  @Input() GridInfo;
  @Input() componentUsage: string;
  @Input() dataDownlader: boolean = true;
  @Input() loader: boolean = true;
  localizationObject: any;
  componentDefinition = {
    listsec: "Company",
    penalty: "Penalty",
    people: "People",
  };

  constructor(
    private http: HttpClient,
    private ajaxService: AjaxHttpService,
    private commos: CommonServiceService
  ) {}

  gridHeight: string = "400px";
  columns: any = [];
  tempData = {};

  orginalData = [];
  endisForm = true;

  columngroups: any;
  data;
  gridData;
  userEditable: boolean = false;
  source = new jqx.dataAdapter({
    localData: this.orginalData,
  });
  togglefont(lang: string) {
    document.documentElement.style.setProperty(
      "--fontdc",
      lang == "en" ? "Monstrate" : "janna-bold"
    );
  }
  @ViewChild("grid", { static: false }) DC: jqxGridComponent;
  header = "";
  needGridData = false;

  private langBehavior: Subscription;
  direction: string = "english";
  languageGetter(): void {
    this.langBehavior = this.commos.languagetter().subscribe((data) => {
      this.direction = data == "en" ? "english" : "arabic";
      if (this.resData) {
        this.grid_localization(this.direction);
        this.dataBindinginGrid(this.resData, this.direction);
        this.togglefont(data);
      }
    });
  }

  ngAfterViewInit(): void {
    this.DC.attrScrollbarsize = 8;
    // this.DC.height(this.GridInfo.height)
  }
  newfunc(type) {
    let data = this.orginalData;
    if (this.orginalData.length == 0) {
      return null;
    }

    let coloumnArray = [];

    this.DC.attrColumns.map((p) => {
      coloumnArray.push(p.displayfield);
    });

    for (let i = 0; i < data.length; i++) {
      let k = Object.keys(data[i]);
      for (let j = 0; j < k.length; j++) {
        if (coloumnArray.includes(k[j]) == false) {
          delete data[i][k[j].toString()];
        }
      }
    }

    let forExcel = [];
    data.map((val) => {
      let newArray = Object.values(val);
      forExcel.push(newArray);
    });
    var propertyOrder = [];
    JSON.parse(this.data.jqdetails)["columns"].map((data) => {
      propertyOrder.push(data.displayfield);
    });

    const reorderProperties = (obj, order) => {
      return order.map((key) => obj[key]);
    };

    const reorderedArray = data.map((obj) =>
      reorderProperties(obj, propertyOrder)
    );

    var Header = Object.keys(reorderedArray[0]);

    if (type == "excel") {
      let reportData = {
        title: this.data.linkscreenname,
        data: reorderedArray,
        headers: propertyOrder,
      };
      // this.excelExport.exportExcel(reportData);
    } else {
      let array = reorderedArray.map((d) => Object.values(d));
      // console.log(this.data)
      // this.commonService.createPdf(
      //   propertyOrder,
      //   array,
      //   this.data,
      //   this.data.linkscreenname
      // );
    }
  }

  ngOnChanges() {
    this.getDataGrid();
    if (this.GridInfo) {
      // this.gridHeight = (`${this.GridInfo.height}` || '400') + 'px';
      this.gridHeight = `${this.GridInfo.height}` || "400px";
    }
  }
  ngOnInit(): void {
    this.languageGetter();
    // this.grid_localization(this.direction)
  }
  resData: any;
  getDataGrid() {
    if (!this.whereCondition) return null;
    let whereCondition = this.whereCondition;
    if (this.loader) this.commos.presentLoader();
    this.ajaxService
      .ajaxPostWithBody(
        `${ServerUrl.liveDomain}${ServerUrl.gridUrl}`,
        whereCondition
      )
      .subscribe(
        (res) => {
          if (this.loader) this.commos.dismissLoader();
          this.resData = res;
          this.dataBindinginGrid(res, this.direction);
        },
        (err) => {}
      );
  }

  actiongridDC = [];
  private translate: TranslateService = inject(TranslateService);
  dataBindinginGrid(res, lang) {
    this.data = res;
    this.orginalData = JSON.parse(res["datavalues"]);
    this.numberOfData.emit(JSON.parse(this.data["datavalues"]).length); //*mark32
    this.source = new jqx.dataAdapter({
      localData: this.orginalData,
    });

    let colums = JSON.parse(this.data.jqdetails)["columns"];
    colums.map((value) => {
      value["text"] = value[lang] ? value[lang] : value["english"];
    });
    this.columns = colums;

    let userck: string = sessionStorage["role"];
    this.actiongridDC = [];

    if (res["displayType"] == "grid" || true) {
      this.actiongridDC = JSON.parse(this.data.jqdetails)[userck];
      this.columngroups = [
        // this.translate.instant('Action')
        {
          text: lang == "english" ? "Action" : "فعل",
          align: "center",
          name: "action1",
        },
      ];
      this.actiongridDC.map((item) => {
        switch (item) {
          case "Activate User":
            if (this.orginalData.length) {
              this.columns.push({
                text: "User Activation",
                datafield: "User Activation",
                renderHTML: true,
                columntype: "button",
                cellsalign: "center",
                align: "center",
                columngroup: "action1",
                width: 150,
                cellsrenderer: (
                  row,
                  row2,
                  columnfield,
                  value,
                  defaulthtml,
                  values
                ): string => {
                  // return `<span style="text-align:center; width: 100%; height: 100%">
                  //               <button class="btn btn-sm " style="background-color: rgba(209, 232, 250, ${1}) ; color: #FFFFFF !important">${JSON.parse(this.data["datavalues"])[row]['UserType'] == 'Airport Officer' ? 'ACTIVE AS ADMIN' : 'ACTIVE AS OFFICER'}</button>
                  //                                           </span> `      ;
                  console.log(
                    JSON.parse(this.data["datavalues"])[row],
                    ",----.,."
                  );
                  return JSON.parse(this.data["datavalues"])[row]["UserType"] ==
                    "Airport Officer"
                    ? "ACTIVE AS ADMIN"
                    : "ACTIVE AS OFFICER";
                },
                cellclassname: "cssclass",
              });
            }

            break;
          case "view and edit":
            this.columns.push({
              datafield: "view and edit",
              text: "",
              columngroup: "action1",
              renderHTML: true,
              columntype: "button",
              cellsalign: "center",
              align: "center",
              width: 120,
              cellsrenderer: (): string => {
                return `<span style="display: flex; justify-content: space-evenly; width: 100%; height: 100%"> 
                <button class="btn btn-sm " style="height: 23px;    font-size: 13px;
                background-color: var(--jqx-grid-header-background-color)  !important; 
                color: var(--refatheme) !important; border: 1px solid rgba(128, 128, 128,0.3)  !important;">View And Edit</button>  
                                             </span>  `; /*mark1*/
              },
              // buttonclick: (row): void => { this.popup(row, true); },
              cellclassname: "cssclass", //mark3
            });
            break;
          case "Generate Permit":
            this.columns.push({
              datafield: "Generate Permit",
              text: "",
              columngroup: "action1",
              renderHTML: true,
              columntype: "button",
              cellsalign: "center",
              align: "center",
              width: 120,
              cellsrenderer: (row): string => {
                return JSON.parse(this.data["datavalues"])[row].Status ==
                  "Accepted"
                  ? "Generate Permit"
                  : JSON.parse(this.data["datavalues"])[row].Status;
              },
              cellclassname: "cssclass", //mark3
            });
            break;
          case "view permit":
            this.columns.push({
              datafield: "View Permit",
              text: "",
              columngroup: "action1",
              renderHTML: true,
              columntype: "button",
              cellsalign: "center",
              align: "center",
              width: 120,
              editable: false,
              cellsrenderer: (row, columnfield, value, defaulthtml): any => {
                if (JSON.parse(this.data["datavalues"])[row]) {
                  const disabledAttribute =
                    JSON.parse(this.data["datavalues"])[row]["Status"] ==
                    "Approved"
                      ? "var(--refatheme)"
                      : "#999999";
                  return `<span style="margin: 4px;   color:${disabledAttribute} ;">view permit </span>`;
                }
                // return '<span style="margin: 4px; float: ' + columnproperties.cellsalign + '; color: #cccccc;">' + value + '</span>';
                // console.log(JSON.parse(this.data["datavalues"])[row].Status == "", 'row value')
                // return JSON.parse(this.data["datavalues"])[row].Status == 'Accepted' ? 'Generate Permit' : JSON.parse(this.data["datavalues"])[row].Status;
                // return 'test'
              },
              cellclassname: "cssclass", //mark3
            });
            break;
          case "generateqr":
            this.columns.push({
              datafield: "Generate QR",
              text: "",
              columngroup: "action1",
              renderHTML: true,
              columntype: "button",
              cellsalign: "center",
              align: "center",
              width: 120,
              cellsrenderer: (row): string => {
                return `
                  <button class="applycustombtn  racCancel text-white" style="text-transform:none;font-weight:400;font-size:12px;margin:0;" 
                                          >Generate Red Tag</button>
                 `;
                //  <span class="badge rounded-pill bg-danger text-white"
                //  style="text-transform:none;font-weight:400;font-size:12px;"
                // >Generate Red Tag</span>
              },
              cellclassname: "cssclass", //mark3
            });
            break;
          case "action button":
            this.columns.push({
              datafield: "active-terms-condition",
              text: "",
              columngroup: "action1",
              renderHTML: true,
              columntype: "button",
              cellsalign: "center",
              align: "center",
              width: 70,
              cellsrenderer: (row): any => {
                if (JSON.parse(this.data["datavalues"])[row])
                  return ` <div> <label style='margin-top: 0px !important'  class=" custom-toggle custom-toggle-default">
                  <input checked="checked" type="checkbox" />
                  <span
                    class=" custom-toggle-slider rounded-circle"
                    data-label-off=${
                      JSON.parse(this.data["datavalues"])[row].isactive
                        ? "OFF"
                        : "ON"
                    }
                    data-label-on=${
                      JSON.parse(this.data["datavalues"])[row].isactive
                        ? "ON"
                        : "OFF"
                    }
                  >
                  </span>
                </label>  </div>`;
              },
              cellclassname: "cssclass",
            });
            break;
          case "action button help":
            this.columns.push({
              datafield: "help text",
              text: "",
              columngroup: "action1",
              renderHTML: true,
              columntype: "button",
              cellsalign: "center",
              align: "center",
              width: 70,
              cellsrenderer: (row): any => {
                if (JSON.parse(this.data["datavalues"])[row])
                  return ` <div> <label style='margin-top: 0px !important'  class=" custom-toggle custom-toggle-default">
                      <input checked="checked" type="checkbox" />
                      <span
                        class=" custom-toggle-slider rounded-circle"
                        data-label-off=${
                          JSON.parse(this.data["datavalues"])[row].isactive
                            ? "OFF"
                            : "ON"
                        }
                        data-label-on=${
                          JSON.parse(this.data["datavalues"])[row].isactive
                            ? "ON"
                            : "OFF"
                        }
                      >
                      </span>
                    </label>  </div>`;
              },
              cellclassname: "cssclass",
            });
            break;
          case "view":
            this.columns.push({
              datafield: "view",
              text: "",
              columngroup: "action1",
              renderHTML: true,
              columntype: "button",
              cellsalign: "center",
              align: "center",
              width: 65,
              title: "click to change the role",
              cellsrenderer: (): string => {
                return `<span title="View" style="margin-left: 6px;"> 
                  <i class="bi bi-eye" style="font-size:20px;color: var(--refatheme)"></i>
                                             </span>  `; /*mark1*/
              },
              // buttonclick: (row): void => { this.popup(row, true); },
              cellclassname: "cssclass", //mark3
            });
            break;
          case "edit":
            this.columns.push({
              datafield: "edit",
              text: "",
              columngroup: "action1",
              renderHTML: true,
              columntype: "button",
              cellsalign: "center",
              align: "center",
              width: 50,
              cellsrenderer: (): string => {
                return `<span title="Edit" style="margin-left: 6px;"> 
                <i class="bi bi-pencil-square" style="font-size:20px;color: var(--refatheme)"></i>
                                 </span> `;
              },
              // buttonclick: (row): void => { this.popup(row, false) },
              cellclassname: "cssclass", //mark3
            });
            break;
          case "Reject":
            this.columns.push({
              datafield: "reject",
              text: "",
              columngroup: "action1",
              renderHTML: true,
              columntype: "button",
              cellsalign: "center",
              align: "center",
              width: 65,
              cellsrenderer: (): string => {
                return `<span title="Reject" style="margin-left: 6px;"> 
                <i class="bi bi-x-octagon" style="font-size:20px;color: var(--refathemeR)"></i>
                                 </span>`;
              },
              cellclassname: "cssclass",
            });
            break;
          case "Approve":
            this.columns.push({
              datafield: "approve",
              text: "",
              columngroup: "action1",
              renderHTML: true,
              columntype: "button",
              cellsalign: "center",
              align: "center",
              width: 65,
              cellsrenderer: (): string => {
                return `<span title="Approve" style="margin-left: 6px;"> 
                <i class="bi bi-check2-circle" style="font-size:22px;color: var(--refathemeG)"></i>
                                 </span>  `;
              },
              cellclassname: "cssclass",
            });
            break;
          case "clone":
            this.columns.push({
              datafield: "clone",
              text: "",
              columngroup: "action1",
              renderHTML: true,
              columntype: "button",
              cellsalign: "center",
              align: "center",
              width: 50,
              cellsrenderer: (): string => {
                return `Clone `;
              },
              cellclassname: "cssclass", //mark3
            });
            break;
          case "delete":
            this.columns.push({
              datafield: "delete",
              text: "",
              columngroup: "action1",
              renderHTML: true,
              columntype: "button",
              cellsalign: "center",
              align: "center",
              width: 50,
              cellsrenderer: (): string => {
                // return "Delete ";
                return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
                <svg width="30px" height="20px" viewBox="0 0 20 35" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
                    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
                        <g id="Icon-Set-Filled" sketch:type="MSLayerGroup" transform="translate(-261.000000, -205.000000)" fill="var(--refatheme)">
                            <path d="M268,220 C268,219.448 268.448,219 269,219 C269.552,219 270,219.448 270,220 L270,232 C270,232.553 269.552,233 269,233 C268.448,233 268,232.553 268,232 L268,220 L268,220 Z M273,220 C273,219.448 273.448,219 274,219 C274.552,219 275,219.448 275,220 L275,232 C275,232.553 274.552,233 274,233 C273.448,233 273,232.553 273,232 L273,220 L273,220 Z M278,220 C278,219.448 278.448,219 279,219 C279.552,219 280,219.448 280,220 L280,232 C280,232.553 279.552,233 279,233 C278.448,233 278,232.553 278,232 L278,220 L278,220 Z M263,233 C263,235.209 264.791,237 267,237 L281,237 C283.209,237 285,235.209 285,233 L285,217 L263,217 L263,233 L263,233 Z M277,209 L271,209 L271,208 C271,207.447 271.448,207 272,207 L276,207 C276.552,207 277,207.447 277,208 L277,209 L277,209 Z M285,209 L279,209 L279,207 C279,205.896 278.104,205 277,205 L271,205 C269.896,205 269,205.896 269,207 L269,209 L263,209 C261.896,209 261,209.896 261,211 L261,213 C261,214.104 261.895,214.999 262.999,215 L285.002,215 C286.105,214.999 287,214.104 287,213 L287,211 C287,209.896 286.104,209 285,209 L285,209 Z" id="trash" sketch:type="MSShapeGroup">
                </path> </g> </g> </svg>`;
              },
              // buttonclick: (row): void => { this.delete(row); },
              cellclassname: "cssclass", //mark3
            });
            break;
          case "archive":
            this.columns.push({
              datafield: "archive",
              text: "",
              renderHTML: true,
              columngroup: "action1",
              columntype: "button",
              cellsalign: "center",
              align: "center",
              width: 50,

              cellsrenderer: (row, value, j, u, o, obj): string => {
                // return JSON.parse(this.data["datavalues"])[row].isArchived ? "Unarchieve" : "Archieve";
                // let arctext = this.ARCHIVED ? "Unarchieve" : "Archive";
                // return arctext;
                return `<span title="${
                  obj["isarchived"] ? "Unarchive" : "Archive"
                }" style="margin-left: 6px;">
                  <i class="bi bi-archive-fill" style="font-size:20px;color: var(--refatheme)"></i> </span>`;
              }, //*mark32
              // buttonclick: (row): void => { this.getRowData(row); },
              cellclassname: "cssclass", //mark3
            });
            break;
          case "private":
            this.columns.push({
              datafield: "private",
              text: "",
              renderHTML: true,
              columngroup: "action1",
              columntype: "button",
              cellsalign: "center",
              align: "center",
              width: 50,

              cellsrenderer: (row, value, j, u, o, obj): string => {
                // return JSON.parse(this.data["datavalues"])[row].isArchived ? "Unarchieve" : "Archieve";
                // let arctext = this.ARCHIVED ? "Unarchieve" : "Archive";
                // return arctext;
                // return `  <span title="Assign As ${obj['isprivate'] ? 'Not' : ''} Private">  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
                //     <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
                //     <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                //   </svg></span>`;
                return `  <span title="${
                  obj["isprivate"] ? "Unfavorite" : "Favorite"
                }"> <i class="bi ${
                  obj["isprivate"] ? "bi-star-fill" : "bi-star"
                } "></i> </span>`; //*mark32
              },
              // buttonclick: (row): void => { this.getRowData(row); },
              cellclassname: "cssclass", //mark3
            });
            break;
          case "assign to":
            this.columns.push({
              datafield: "assign to",
              text: "",
              renderHTML: true,
              columngroup: "action1",
              columntype: "button",
              cellsalign: "center",
              align: "center",
              width: 50,

              cellsrenderer: (row): string => {
                // return JSON.parse(this.data["datavalues"])[row].isArchived ? "Unarchieve" : "Archieve";
                // let arctext = this.ARCHIVED ? "Unarchieve" : "Archive";
                // return arctext;
                return `<i title="Assign To Company" style="font-size:20px;" class="bi bi-arrow-bar-right"></i>`;
              },
              // buttonclick: (row): void => { this.getRowData(row); },
              cellclassname: "cssclass", //mark3
            });
            break;
          case "download":
            this.columns.push({
              datafield: "download",
              text: "",
              renderHTML: true,
              columngroup: "action1",
              columntype: "button",
              cellsalign: "center",
              align: "center",
              width: 50,
              cellsrenderer: (row): string => {
                return `<i title="Assign To Company" style="font-size:20px;color: var(--refatheme)" class="bi bi-download"></i>`;
              },
              cellclassname: "cssclass",
            });
            break;
        }
      });

      if (
        this.actiongridDC.includes("action button") &&
        this.orginalData.length &&
        false
      ) {
        let result = this.orginalData.filter(
          ({ isactive }) => isactive === true || isactive === false
        );
        if (result.length) {
          this.columns.push({
            datafield: "active-terms-condition",
            text: "",
            columngroup: "action1",
            renderHTML: true,
            columntype: "button",
            cellsalign: "center",
            align: "center",
            width: 70,
            cellsrenderer: (row): string => {
              return ` <div> <label style='margin-top: 0px !important'  class=" custom-toggle custom-toggle-default">
                    <input checked="checked" type="checkbox" />
                    <span
                      class=" custom-toggle-slider rounded-circle"
                      data-label-off=${
                        JSON.parse(this.data["datavalues"])[row].isactive
                          ? "OFF"
                          : "ON"
                      }
                      data-label-on=${
                        JSON.parse(this.data["datavalues"])[row].isactive
                          ? "ON"
                          : "OFF"
                      }
                    >
                    </span>
                  </label>  </div>`;
            },
            cellclassname: "cssclass", //mark3
          });
        }
      }

      if (
        this.actiongridDC.includes("Activate User") &&
        this.orginalData.length
      ) {
        if (this.orginalData[0].hasOwnProperty("isdelete")) {
          let result = [];
          result = this.orginalData.filter(({ isdelete }) => isdelete === true);
          if (result.length) {
            this.columns.push({
              text: "User Activation",
              datafield: "User Activation",
              renderHTML: true,
              columntype: "button",
              cellsalign: "center",
              align: "center",
              width: 120,
              cellsrenderer: (row): string => {
                return `<span style="display: flex; justify-content: space-evenly; width: 100%; height: 100%"> 
                                <button class="btn btn-sm " style="background-color: rgba(209, 232, 250, ${1}) ; color: rgba(0, 0, 0, ${1})">ACTIVATE USER</button>  
                                                             </span> `;
              },
              cellclassname: "cssclass",
            });
          }
        }
      }
    } else if (res["displayType"] == "administrator" && false) {
      this.columns.push({
        text: "Role Change",
        datafield: "Role Change",
        renderHTML: true,
        columntype: "button",
        cellsalign: "center",
        align: "center",
        width: 250,
        cellsrenderer: (row): string => {
          // return JSON.parse(this.data["datavalues"])[row].Role == "Company Admin" ? "Company Admin" : "Company User";
          return JSON.parse(this.data["datavalues"])[row].Role ==
            "Company Admin"
            ? `<span style="display: flex; justify-content: space-evenly; width: 100%; height: 100%"> 
                  <button class="btn btn-sm " style="background-color: rgba(209, 232, 250, ${1}) ; color: rgba(0, 0, 0, ${1})">Company Admin</button>  
                <button class="btn btn-sm " style="background-color: rgba(209, 232, 250, ${0.34}); color:  rgba(0, 0, 0, ${0.34})">Company User</button> 
                </span> `
            : `<span style="display: flex; justify-content: space-evenly; width: 100%; height: 100%"> 
                   <button class="btn btn-sm " style="background-color: rgba(209, 232, 250, ${0.34}) ; color: rgba(0, 0, 0, ${0.34})">Company Admin</button>  
                 <button class="btn btn-sm " style="background-color: rgba(209, 232, 250, ${1}); color:  rgba(0, 0, 0, ${1})">Company User</button> 
                 </span> `;
        },
        // buttonclick: (row): void => {
        //   // this.changeRole(row)
        // },
        cellclassname: "cssclass", //mark3
      });
    }
  }

  cellClickRow(e) {
    let local = JSON.parse(this.data["datavalues"])[e.args.rowindex];
    if (e.args.datafield)
      this.abcd_data_emit.emit({
        data: local,
        action_type: e.args.datafield,
        api: this.data.entity,
        primary: this.data.primarykey,
        primaryColName: JSON.parse(this.data.columnnames)[this.data.primarykey],
      });
  }

  ngOnDestroy(): void {}

  grid_localization(lang: string) {
    // this.localizationObject = {
    //   pagergotopagestring: 'Aller à la page:',
    //   pagershowrowsstring: 'Afficher les lignes:',
    //   pagerrangestring: ' de ',
    //   pagernextbuttonstring: 'Suivant',
    //   pagerpreviousbuttonstring: 'Précédent',
    //   sortascendingstring: 'Trier par ordre croissant',
    //   sortdescendingstring: 'Trier par ordre décroissant',
    //   sortremovestring: 'Supprimer le tri',
    //   firstDay: 1,
    // };
    // this.DC.localization(this.localizationObject)
    //   this.localizationObject = {
    //     pagergotopagestring: 'Go to page:',
    //     pagershowrowsstring: 'Show rows:',
    //     pagerrangestring: ' of ',
    //     pagernextbuttonstring: 'Next',
    //     pagerpreviousbuttonstring: 'Previous',
    //     sortascendingstring: 'Sort Ascending',
    //     sortdescendingstring: 'Sort Descending',
    //     sortremovestring: 'Remove Sort',
    //     todaystring: 'Today',
    //     clearstring: 'Clear'
    //   };
  }
}
