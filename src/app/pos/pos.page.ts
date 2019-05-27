import {Component, OnInit} from '@angular/core';
import {UpdateService} from '../service/update.service';
import {OrderService} from '../service/order.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-pos',
    templateUrl: './pos.page.html',
    styleUrls: ['./pos.page.scss'],
})
export class PosPage implements OnInit {
    total: number;
    quantity: number;

    constructor(private router: Router, private orderService: OrderService) {
    }

    ngOnInit() {
        this.orderService.total.subscribe((total) => {
            this.total = total;
        });
        this.orderService.quantity.subscribe((quantity) => {
            this.quantity = quantity;
        });
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
