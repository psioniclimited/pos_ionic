import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
    selector: 'app-order-detail-modal',
    templateUrl: './order-detail-modal.page.html',
    styleUrls: ['./order-detail-modal.page.scss'],
})
export class OrderDetailModalPage implements OnInit {
    @Input() product: any;

    constructor(private modalController: ModalController) {
    }

    ngOnInit() {
    }

    dismiss() {
        this.modalController.dismiss().catch();
    }

}
