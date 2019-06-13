import {Component, OnInit} from '@angular/core';
import {UpdateService} from '../service/update.service';
import {AlertController, LoadingController, NavController} from '@ionic/angular';
import {BluetoothPrinterService} from '../bluetooth-printer.service';
import {SyncService} from '../service/sync.service';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {AuthService} from '../service/auth.service';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.page.html',
    styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
    printerStatus = false;

    pages = [
        {
            title: 'Pos',
            url: '/menu/pos',
            icon: 'home'
        },
        {
            title: 'Order History',
            url: '/menu/orderHistory',
            icon: 'archive'
        }
    ];

    constructor(private updateService: UpdateService,
                private alertController: AlertController,
                private bluetoothPrinterService: BluetoothPrinterService,
                private loadingController: LoadingController,
                private syncService: SyncService,
                private router: Router,
                private navCtrl: NavController,
                private authService: AuthService) {
    }

    ngOnInit() {
        this.bluetoothPrinterService.printerStatus.subscribe((status) => {
            this.printerStatus = status;
        });
    }

    async update() {
        const alert = await this.alertController.create({
            header: 'Update',
            message: 'Are you sure you want to <strong>Update</strong>!!!',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('Confirm Cancel: blah');
                    }
                }, {
                    text: 'Okay',
                    handler: (() => {
                        this.updateDatabase();
                    })
                }
            ]
        });

        await alert.present();
    }

    async updateDatabase() {
        console.log('in the menu update method');
        const loading = await this.loadingController.create({
            message: 'Updating',
        });
        await loading.present();
        await this.updateService.index().then(async () => {
            console.log('update done ====');
            await loading.dismiss();
            this.updateService.isUpdated.next(true);
        }).catch(async (error) => {
            await loading.dismiss();
            if (error.status === 401) {
                // remove the token
                await this.authService.removeToken();
                const alert = await this.alertController.create({
                    header: 'Token Expired',
                    message: 'Your token has been expired, Please login again',
                    buttons: [
                        {
                            text: 'Okay',
                            role: 'cancel',
                            cssClass: 'secondary',
                            handler: (blah) => {
                                this.router.navigateByUrl('login');
                            }
                        }
                    ]
                });

                await alert.present();
            }
        });
    }

    async connectPrinter() {
        await this.bluetoothPrinterService.connectPrinter();
    }

    async syncData() {
        const loading = await this.loadingController.create({
            message: 'Syncing'
        });
        await loading.present();
        await this.syncService.syncData();
        loading.dismiss();
        const alert = await this.alertController.create({
            header: 'Sync Completed',
            message: 'synchronization Successful',
            buttons: [
                {
                    text: 'Okay',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('Confirm Cancel: blah');
                    }
                }
            ]
        });
        await alert.present();
    }

}
