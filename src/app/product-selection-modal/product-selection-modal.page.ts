import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {OrderService} from '../service/order.service';
import {Order} from '../_models/order';
import {OrderDetail} from '../_models/order-detail';
import * as _ from 'lodash';
import {Addon} from '../_models/addon';

@Component({
    selector: 'app-product-selection-modal',
    templateUrl: './product-selection-modal.page.html',
    styleUrls: ['./product-selection-modal.page.scss'],
})
export class ProductSelectionModalPage implements OnInit {
    @Input() product: any;
    selectedOption: any;
    quantity = 1;
    addonList: Addon[];

    constructor(private modalController: ModalController, private orderService: OrderService) {
    }

    ngOnInit() {
        const selectedAddon = this.product.addons;
        for (let i = 0; i < selectedAddon.length; i++) {
            selectedAddon[i].isChecked = false;
        }
        this.addonList = [];
    }

    checkAddons() {
        const selectedAddon = this.product.addons;
        this.addonList = [];
        for (let i = 0; i < selectedAddon.length; i++) {
            if (selectedAddon[i].isChecked) {
                this.addonList.push(selectedAddon[i]);
            }
        }
    }

    addProduct() {
        if (this.orderService.getOrder() == null) {
            this.createOrder();
            this.dismiss();
        } else {
            const order = this.orderService.getOrder();
            const productIndex = _.findIndex(order.orderDetails, (orderDetail) => {
                return orderDetail.product.id == this.product.id
                    && (this.product.hasOptions === 0 || orderDetail.option.id == this.selectedOption);
            });
            // add existing product
            if (productIndex >= 0) {
                console.log('order details ========');
                console.log(order.orderDetails[productIndex]);
                // for (let i = 0; i < this.addonList.length; i++) {
                //     order.orderDetails[productIndex].addon.push(this.addonList[i]);
                // }
                if (this.addonList.length === order.orderDetails[productIndex].addon.length) {
                    let addonsSame = true;
                    for (let i = 0; i < this.addonList.length; i++) {
                        if (this.addonList[i].id !== order.orderDetails[productIndex].addon[i].id) {
                            addonsSame = false;
                        }
                    }
                    if (addonsSame) {
                        order.orderDetails[productIndex].quantity += this.quantity;
                    } else {
                        this.createOrderDetail(order);
                    }
                } else {
                    this.createOrderDetail(order);
                }

                this.orderService.setOrder(order);
            } else {
                this.createOrderDetail(order);
            }
            this.dismiss();
        }
        console.log(this.orderService.getOrder());
    }

    private createOrderDetail(order) {
        const option = this.findOption();
        order.orderDetails.push(new OrderDetail(
            option,
            this.product,
            this.selectedOption && this.selectedOption.price || null,
            this.quantity,
            this.addonList
        ));
        this.orderService.setOrder(order);
    }

    createOrder() {
        const order = new Order();
        const option = this.findOption();
        order.orderDetails.push(new OrderDetail(
            option,
            this.product,
            this.selectedOption && this.selectedOption.price || null,
            this.quantity,
            this.addonList
        ));
        // update total of order
        // order.total = (this.selectedOption && this.selectedOption.price) * this.quantity ||
        //     this.product.price * this.quantity;
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
        if (this.quantity > 1) {
            --this.quantity;
        }
    }

    dismiss() {
        this.modalController.dismiss().catch();
    }
}
