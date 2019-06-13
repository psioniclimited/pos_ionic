import {Component} from '@angular/core';

import {NavController, Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {DatabaseService} from './service/database.service';
import {BluetoothPrinterService} from './bluetooth-printer.service';
import {AuthService} from './service/auth.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent {
    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private navCtrl: NavController,
        private bluetoothPrinterService: BluetoothPrinterService,
        private authService: AuthService,
        private router: Router
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(async () => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            await this.bluetoothPrinterService.connectPrinter();
            this.authService.getToken().then(authenticated => {
                if (authenticated) {
                    this.router.navigateByUrl('menu');
                }
            }).catch((error) => {
                console.log('native storage error');
                console.log(error);
            });
        });
    }
}
