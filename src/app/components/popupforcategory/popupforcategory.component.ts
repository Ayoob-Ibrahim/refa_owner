import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { ComponentModule } from "../../modules/component.module";
import { MatFormFieldModule } from "@angular/material/form-field";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
@Component({
  selector: "app-popupforcategory",
  standalone: true,
  imports: [
    ComponentModule,
    MatFormFieldModule,
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: "./popupforcategory.component.html",
  styleUrl: "./popupforcategory.component.scss",
})
export class PopupforcategoryComponent {
  newName: string = "";

  constructor(public dialogRef: MatDialogRef<PopupforcategoryComponent>) {}

  onAdd(): void {
    this.dialogRef.close(this.newName);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
