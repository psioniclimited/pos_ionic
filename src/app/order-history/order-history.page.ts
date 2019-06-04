import {Component, OnInit} from '@angular/core';
import {OrderService} from '../service/order.service';

@Component({
    selector: 'app-order-history',
    templateUrl: './order-history.page.html',
    styleUrls: ['./order-history.page.scss'],
})
export class OrderHistoryPage implements OnInit {
    orderCollection: any;

    constructor(private orderService: OrderService) {
    }

    async ngOnInit() {
        await this.orderService.getOrdersFromDB(0).then((data) => {
            this.orderCollection = data;
            console.log(data);
        }).catch((error) => {
            console.log('error in order fetching');
            console.log(error);
        });
    }

    public async getHistory(event: any) {
        const customerName = event.target.value;
        await this.orderService.getOrdersFromDB(0, customerName).then((data) => {
            this.orderCollection = data;
            console.log(data);
        }).catch((error) => {
            console.log('error in order fetching while client search');
            console.log(error);
        });
    }

}
