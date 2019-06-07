import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
    selector: 'app-order-detail-modal',
    templateUrl: './order-detail-modal.page.html',
    styleUrls: ['./order-detail-modal.page.scss'],
})
export class OrderDetailModalPage implements OnInit {
    @Input() orderCollection: any;

    constructor(private modalController: ModalController) {
    }

    ngOnInit() {
        console.log(this.orderCollection);
    }

    dismiss() {
        this.modalController.dismiss().catch();
    }

}
