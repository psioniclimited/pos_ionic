import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-order-detail-modal',
    templateUrl: './order-detail-modal.page.html',
    styleUrls: ['./order-detail-modal.page.scss'],
})
export class OrderDetailModalPage implements OnInit {
    @Input() product: any;

    constructor() {
    }

    ngOnInit() {
    }

}
