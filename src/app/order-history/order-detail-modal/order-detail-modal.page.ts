import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {OrderService} from '../../service/order.service';

@Component({
    selector: 'app-order-detail-modal',
    templateUrl: './order-detail-modal.page.html',
    styleUrls: ['./order-detail-modal.page.scss'],
})
export class OrderDetailModalPage implements OnInit {
    @Input() order: any;
    orderDetails: any;
    total: number;

    constructor(private modalController: ModalController,
                private orderService: OrderService) {
    }

    async ngOnInit() {
        await this.orderService.getOrderDetails(this.order.id).then((data) => {
            this.orderDetails = data;
            console.log(this.orderDetails);

            const subTotal = this.order.total;
            const discount = this.order.discount;
            this.total = subTotal - (subTotal * discount / 100);
        }).catch((error) => {
            console.log(error);
        });
    }

    dismiss() {
        this.modalController.dismiss().catch();
    }


}
