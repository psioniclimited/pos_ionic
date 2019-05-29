import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {HTTP} from '@ionic-native/http/ngx';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {SQLite} from '@ionic-native/sqlite/ngx';
import {ProductSelectionModalPageModule} from './product-selection-modal/product-selection-modal.module';
import {DiscountModalPageModule} from './discount-modal/discount-modal.module';
import {BluetoothSerial} from '@ionic-native/bluetooth-serial/ngx';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        IonicModule.forRoot({hardwareBackButton: false}),
        AppRoutingModule,
        ProductSelectionModalPageModule,
        DiscountModalPageModule
    ],
    providers: [
        StatusBar,
        SplashScreen,
        HTTP,
        NativeStorage,
        SQLite,
        BluetoothSerial,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
