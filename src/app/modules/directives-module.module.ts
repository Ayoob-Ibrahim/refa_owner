import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorMessageDirective } from '../directives/error-message.directive';
import { OnlyNumbersDirective } from '../directives/keypress.directive';
import { languageDirectionDirective } from '../directives/language.directuve';
import { PasswordVerificationDirective } from '../directives/password-verification.directive';


@NgModule({
  declarations: [ErrorMessageDirective, OnlyNumbersDirective, languageDirectionDirective, PasswordVerificationDirective],
  imports: [
    CommonModule
  ],
  exports: [ErrorMessageDirective, OnlyNumbersDirective, languageDirectionDirective, PasswordVerificationDirective]

})


export class DirectivesModuleModule { }
