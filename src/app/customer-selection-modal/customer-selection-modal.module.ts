import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CustomerSelectionModalPage } from './customer-selection-modal.page';

const routes: Routes = [
  {
    path: '',
    component: CustomerSelectionModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CustomerSelectionModalPage]
})
export class CustomerSelectionModalPageModule {}
