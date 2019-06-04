import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {MenuPage} from './menu.page';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/menu/pos',
        pathMatch: 'full'
    },
    {
        path: '',
        component: MenuPage,
        children: [
            {
                path: 'pos',
                loadChildren: '../pos/pos.module#PosPageModule'
            },
            {   path: 'orderHistory',
                loadChildren: '../order-history/order-history.module#OrderHistoryPageModule'
            },
        ]
    },
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes)
    ],
    declarations: [MenuPage]
})
export class MenuPageModule {
}
