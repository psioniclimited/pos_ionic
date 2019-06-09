import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {OrderService} from '../../service/order.service';

@Component({
    selector: 'app-order-detail-modal',
    templateUrl: './order-detail-modal.page.html',
    styleUrls: ['./order-detail-modal.page.scss'],
})
export class OrderDetailModalPage implements OnInit {
    @Input() orderCollection: any;
    orderDetails: any;

    constructor(private modalController: ModalController,
                private orderService: OrderService) {
    }

    async ngOnInit() {
        console.log(this.orderCollection);
        await this.orderService.getOrderDetails(this.orderCollection.id).then((data) => {
        this.orderDetails = data;
        console.log(this.orderDetails);
        }).catch((error) => {
            console.log(error);
        });
    }

    dismiss() {
        this.modalController.dismiss().catch();
    }

}
