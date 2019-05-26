import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {OrderService} from '../service/order.service';
import {Order} from '../_models/order';
import {OrderDetail} from '../_models/order-detail';
import {Option} from '../_models/option';
import * as _ from 'lodash';

@Component({
    selector: 'app-product-selection-modal',
    templateUrl: './product-selection-modal.page.html',
    styleUrls: ['./product-selection-modal.page.scss'],
})
export class ProductSelectionModalPage implements OnInit {
    @Input() product: any;
    selectedOption: any;
    quantity = 1;

    constructor(private modalController: ModalController, private orderService: OrderService) {
    }

    ngOnInit() {
    }

    addProduct() {
        if (this.orderService.getOrder() == null) {
            this.createOrder();
            this.dismiss();
        } else {
            const order = this.orderService.getOrder();
            const productIndex = _.findIndex(order.orderDetails, (orderDetail) => {
                return orderDetail.product.id == this.product.id && orderDetail.option.id == this.selectedOption;
            });

            if (productIndex >= 0) {
                order.orderDetails[productIndex].quantity += this.quantity;
                this.orderService.setOrder(order);
            } else {
                const option = this.findOption();
                console.log('====>');
                console.log(option);
                order.orderDetails.push(new OrderDetail(
                    option,
                    this.product,
                    this.selectedOption.price,
                    this.quantity
                ));
            }
            this.dismiss();
        }
        console.log(this.orderService.getOrder());
    }

    createOrder() {
        const order = new Order();
        const option = this.findOption();
        order.orderDetails.push(new OrderDetail(
            option,
            this.product,
            this.selectedOption.price,
            this.quantity
        ));
        this.orderService.setOrder(order);
    }

    findOption() {
        return _.find(this.product.options, (o) => {
            return o.id == this.selectedOption;
        });
    }

    add() {
        ++this.quantity;
    }

    sub() {
        if (this.quantity > 0) {
            --this.quantity;
        }
    }

    dismiss() {
        this.modalController.dismiss().catch();
    }

}
