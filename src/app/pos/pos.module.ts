import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {PosPage} from './pos.page';
import {TopbarComponent} from '../components/topbar/topbar.component';
import {ProductListComponent} from '../components/product-list/product-list.component';
import {CategoryListComponent} from '../components/category-list/category-list.component';

const routes: Routes = [
    {
        path: '',
        component: PosPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes)
    ],
    declarations: [PosPage, TopbarComponent, ProductListComponent, CategoryListComponent]
})
export class PosPageModule {
}
