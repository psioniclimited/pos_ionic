import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'home', loadChildren: './home/home.module#HomePageModule'},
    {path: 'login', loadChildren: './login/login.module#LoginPageModule'},
    {path: 'menu', loadChildren: './menu/menu.module#MenuPageModule'},
    {path: 'modal', loadChildren: './product-selection-modal/product-selection-modal.module#ProductSelectionModalPageModule'},
    {path: 'cart', loadChildren: './cart/cart.module#CartPageModule'},
    {
        path: 'customer-selection-modal',
        loadChildren: './customer-selection-modal/customer-selection-modal.module#CustomerSelectionModalPageModule'
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
