import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from "ngx-bootstrap";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SessionModalComponent } from './session-modal/session-modal.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { InputEmailComponent } from './input-email/input-email.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
  ],
  declarations: [
    SessionModalComponent,
    ConfirmModalComponent,
    InputEmailComponent
  ],
  entryComponents: [
    SessionModalComponent,
    ConfirmModalComponent,
    InputEmailComponent
  ],
  exports: [
    SessionModalComponent,
    ConfirmModalComponent,
    InputEmailComponent
  ]
})
export class SharedModule { }
