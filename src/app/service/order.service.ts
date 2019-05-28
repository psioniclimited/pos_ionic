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
    discount = new BehaviorSubject(0);
    grandTotal = new BehaviorSubject(0);

    constructor() {}

    setOrder(order: Order) {
        this.order = order;
        if (this.order) {
            order.total = this.calculateTotal();
            this.setGrandTotal();
            this.setTotal();
            this.setQuantity();
        } else {
            this.total.next(0);
            this.quantity.next(0);
            this.grandTotal.next(0);
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

    setGrandTotal() {
        const grandTotal = this.order.total - (this.order.total * this.order.discount) / 100;
        this.grandTotal.next(grandTotal);
    }

    increaseQuantity(orderDetailIndex) {
        this.order.orderDetails[orderDetailIndex].quantity += 1;
        this.order.total = this.calculateTotal();
        this.setTotal();
        this.setQuantity();
        this.setGrandTotal();
    }

    decreaseQuantity(orderDetailIndex) {
        if (this.order.orderDetails[orderDetailIndex].quantity > 1) {
            this.order.orderDetails[orderDetailIndex].quantity -= 1;
            this.order.total = this.calculateTotal();
            this.setTotal();
            this.setQuantity();
            this.setGrandTotal();
        }
    }

    setDiscount(discount) {
        this.order.discount = discount;
        this.discount.next(discount);
        this.setGrandTotal();
    }

    removeOrderDetail(orderDetailIndex) {
        this.order.orderDetails.splice(orderDetailIndex, 1);
        this.order.total = this.calculateTotal();
        this.setTotal();
        this.setQuantity();
        this.setGrandTotal();
    }
}
