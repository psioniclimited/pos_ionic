import {Component, OnInit} from '@angular/core';
import {UpdateService} from '../service/update.service';
import {AlertController, LoadingController} from '@ionic/angular';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.page.html',
    styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

    pages = [
        {
            title: 'Pos',
            url: '/menu/pos',
            icon: 'home'
        }
    ];

    constructor(private updateService: UpdateService,
                private alertController: AlertController,
                private loadingController: LoadingController) {
    }

    ngOnInit() {
    }

    async update() {
        console.log('update click');
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
                        this.updateService.index().then(() => {
                            console.log('update done ====');
                        }).catch((error) => {
                            console.log('updating error');
                            console.log(error);
                        });
                    })
                }
            ]
        });

        await alert.present();
    }

}
