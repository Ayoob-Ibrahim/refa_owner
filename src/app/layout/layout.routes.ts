import { Routes } from "@angular/router";
import { SidebarComponent } from "../structure/sidebar/sidebar.component";
import { DashboardComponent } from "../pages/dashboard/dashboard.component";
import { PropertiesApprovalComponent } from "../pages/properties-approval/properties-approval.component";
import { LayoutComponent } from "./layout.component";
import { AuthGuard } from "../auth-guard/authguard";
import { TestadminComponent } from "../pages/testadmin/testadmin.component";
import { TenantsComponent } from "../pages/tenants/tenants.component";
import { AgenciesOwnerComponent } from "../pages/agencies-owner/agencies-owner.component";
import { RentRequestComponent } from "../pages/rent-request/rent-request.component";
import { ContractComponent } from "../pages/contract/contract.component";
import { SettingsComponent } from "../pages/settings/settings.component";
import { PageRefreshComponent } from "../pages/page-refresh/page-refresh.component";

export const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "dashboard",
        component: DashboardComponent,
      },
      {
        path: "property-approval",
        component: PropertiesApprovalComponent,
      },

      {
        path: "tenant",
        component: TenantsComponent,
      },
      {
        path: "agencies-owner",
        component: AgenciesOwnerComponent,
      },

      {
        path: "rent-request",
        component: RentRequestComponent,
      },
      {
        path: "contract",
        component: ContractComponent,
      },
      {
        path: "setting",
        component: SettingsComponent,
      },
      {
        path: "testadmin",
        component: TestadminComponent,
      },
      {
        path: "refresh",
        component: PageRefreshComponent,
      },
    ],
  },
];
