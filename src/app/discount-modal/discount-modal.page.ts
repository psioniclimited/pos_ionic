import {Component, Input, OnInit} from '@angular/core';
import {OrderService} from '../service/order.service';

@Component({
    selector: 'app-discount-modal',
    templateUrl: './discount-modal.page.html',
    styleUrls: ['./discount-modal.page.scss'],
})
export class DiscountModalPage implements OnInit {
    @Input() discount: any;

    constructor(private orderService: OrderService) {
    }

    ngOnInit() {
    }

    setDiscount() {
        this.orderService.setDiscount(this.discount);
    }

}
