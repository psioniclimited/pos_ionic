import {Injectable} from '@angular/core';
import {Order} from '../_models/order';
import {OrderDetail} from '../_models/order-detail';
import * as _ from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    order: Order;

    constructor() {
    }

    setOrder(order: Order) {
        this.order = order;
        order.total = this.calculateTotal();
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

    addProduct(orderDetail: OrderDetail) {
        // verification
        this.order.orderDetails.push(orderDetail);
    }
}
