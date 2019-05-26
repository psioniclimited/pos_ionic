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
                const option = this.findOptionIndex();
                console.log('====>');
                console.log(option);
                console.log('====>');
                console.log(this.product);
                console.log('====>');
                console.log(this.selectedOption);
                order.orderDetails.push(new OrderDetail(
                    this.product.options[option], // here is problem
                    this.product,
                    this.selectedOption.price,
                    this.quantity
                ));
            }
            this.dismiss();
        }
        console.log(this.orderService.getOrder());
    }

    private findOptionIndex() {
        console.log('in the findOptionIndex');
        for (let i = 0; i < this.product.options.length; i++) {
            const temp = this.selectedOption + '';
            const temp2 = this.product.options[i].id + '';
            if (temp === temp2) {
                console.log('working here');
                return i;
            }
        }
    }

    private findOderOptions(order: Order) {
        for (let i = 0; i < order.orderDetails.length; i++) {
            if (this.product.id === order.orderDetails[i].product.id) {
                const temp = this.selectedOption + '';
                const temp2 = order.orderDetails[i].option.id + '';
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
        const option = this.findOptionIndex();
        order.orderDetails.push(new OrderDetail(
            this.product.options[option],
            this.product,
            this.selectedOption.price,
            this.quantity
        ));
        this.orderService.setOrder(order);
    }

    findOption() {
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
