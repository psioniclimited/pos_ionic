import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {OrderService} from '../service/order.service';
import {Order} from '../_models/order';
import {OrderDetail} from '../_models/order-detail';
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
            const productIndex = this.findOderOptions(order);

            if (productIndex >= 0) {
                order.orderDetails[productIndex].quantity += this.quantity;
                this.orderService.setOrder(order);
            } else {
                const option = this.findOption();
                console.log('====>');
                console.log(this.product);
                console.log('====>');
                console.log(this.selectedOption);
                order.orderDetails.push(new OrderDetail(
                    this.product.options[this.selectedOption - 1], // here is problem
                    this.product,
                    this.selectedOption.price,
                    this.quantity
                ));
            }
            this.dismiss();
        }
        console.log(this.orderService.getOrder());
    }

    private findOderOptions(order: Order) {
        if (this.product.id == order.orderDetails[0].product.id) {
            console.log('done');
        } else {
            console.log('not done');
        }

        if (this.selectedOption == order.orderDetails[0].option.id) {
            console.log('done option');
        } else {
            console.log('not done option');
        }
        for (let i = 0; i < order.orderDetails.length; i++) {
            console.log('======================' + i);
            console.log(this.product.id);
            console.log(order.orderDetails[i].product.id);
            console.log(order.orderDetails[i].option.id);
            console.log(this.selectedOption);
            console.log('======================');
            if (this.product.id === order.orderDetails[i].product.id) {
                const  temp = this.selectedOption + '';
                const  temp2 = order.orderDetails[i].option.id + '';
                console.log(temp);
                console.log(order.orderDetails[i].option.id);
                console.log('hrerherhe');
                if (temp2 === temp) {
                    console.log('working');
                    return i;
                }

            }
        }
        return -1;
    }

    createOrder() {
        const order = new Order();
        const option = this.findOption();
        order.orderDetails.push(new OrderDetail(
            this.product.options[this.selectedOption - 1],
            this.product,
            this.selectedOption.price,
            this.quantity
        ));
        this.orderService.setOrder(order);
    }

    findOption() {
        console.log('==================');
        console.log(this.selectedOption);
        return _.find(this.product.options, (o) => {
            return o.id === this.selectedOption;
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
