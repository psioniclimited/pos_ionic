import {Component, OnInit} from '@angular/core';
import {UpdateService} from '../service/update.service';
import {OrderService} from '../service/order.service';
import {Router} from '@angular/router';
import {Platform} from '@ionic/angular';

@Component({
    selector: 'app-pos',
    templateUrl: './pos.page.html',
    styleUrls: ['./pos.page.scss'],
})
export class PosPage implements OnInit {
    total: number;
    quantity: number;

    constructor(private router: Router,
                private orderService: OrderService,
                private platform: Platform) {
    }

    ngOnInit() {
        this.orderService.total.subscribe((total) => {
            this.total = total;
        });
        this.orderService.quantity.subscribe((quantity) => {
            this.quantity = quantity;
        });
        this.platform.ready().then(() => {
            this.platform.backButton.subscribe(() => {
                console.log('working on it');
            });
        });
    }

    ionViewDidEnter() {
        document.addEventListener('backbutton', (e) => {
            console.log('disable back button');
        }, false);
    }

    public loadCart() {
        this.router.navigate(['cart']);
    }

    public async updateMenu() {
        // await this.updateService.index().then().catch((error) => {
        //     console.log(error);
        // });
    }

}
