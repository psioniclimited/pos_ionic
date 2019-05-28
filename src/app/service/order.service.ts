import {Injectable} from '@angular/core';
import {Order} from '../_models/order';
import {OrderDetail} from '../_models/order-detail';
import * as _ from 'lodash';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    order: Order;
    total = new BehaviorSubject(0);
    quantity = new BehaviorSubject(0);
    isSetSharedOrder = new BehaviorSubject(false);

    constructor() {
    }

    setOrder(order: Order) {
        this.order = order;
        if (this.order) {
            order.total = this.calculateTotal();
            this.setTotal();
            this.setQuantity();
        } else {
            this.total.next(0);
            this.quantity.next(0);
        }
    }

    getOrder() {
        return this.order;
    }

    calculateTotal() {
        return _.sumBy(this.order.orderDetails, (orderDetail) => {
            if (orderDetail.option) {
                return orderDetail.option.price * orderDetail.quantity;
            } else {
                return orderDetail.product.salePrice * orderDetail.quantity;
            }
        });
    }

    setTotal() {
        this.total.next(this.order.total);
    }

    setQuantity() {
        const quantity = _.sumBy(this.order.orderDetails, (orderDetail) => {
            return orderDetail.quantity;
        });
        this.quantity.next(quantity);
    }

    increaseQuantity(orderDetailIndex) {
        this.order.orderDetails[orderDetailIndex].quantity += 1;
        this.order.total = this.calculateTotal();
        this.setTotal();
        this.setQuantity();
    }

    decreaseQuantity(orderDetailIndex) {
        if (this.order.orderDetails[orderDetailIndex].quantity > 1) {
            this.order.orderDetails[orderDetailIndex].quantity -= 1;
            this.order.total = this.calculateTotal();
            this.setTotal();
            this.setQuantity();
        }
    }

    removeOrderDetail(orderDetailIndex) {
        this.order.orderDetails.splice(orderDetailIndex, 1);
        this.order.total = this.calculateTotal();
        this.setTotal();
        this.setQuantity();
    }
}
