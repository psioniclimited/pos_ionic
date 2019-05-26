import {Injectable} from '@angular/core';
import {Order} from '../_models/order';
import {OrderDetail} from '../_models/order-detail';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    order: Order;

    constructor() {
    }

    setOrder(order: Order) {
        this.order = order;
    }

    getOrder() {
        return this.order;
    }

    addProduct(orderDetail: OrderDetail) {
        // verification
        this.order.orderDetails.push(orderDetail);
    }
}
