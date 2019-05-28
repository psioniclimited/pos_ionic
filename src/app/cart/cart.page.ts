import {Component, OnInit} from '@angular/core';
import {OrderService} from '../service/order.service';
import {Order} from '../_models/order';
import {Router} from '@angular/router';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.page.html',
    styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
    order: Order;
    total: number;

    constructor(private orderService: OrderService,
                private router: Router) {
    }

    ngOnInit() {
        // this.order = new Order();
        this.order = this.orderService.getOrder();
        this.orderService.total.subscribe((total) => {
            this.total = total;
        });
    }

    ionViewWillEnter() {
    }

    calculateItemTotal(orderDetail) {
        if (orderDetail.option) {
            return orderDetail.option.price * orderDetail.quantity;
        }
        return orderDetail.product.salePrice * orderDetail.quantity;
    }

    getDescription(orderDetail) {
        let description = orderDetail.product.name;
        if (orderDetail.option) {
            description += ' ' + orderDetail.option.type;
        }
        return description;
    }

    increaseQuantity(orderDetailIndex) {
        // console.log(orderDetailIndex);
        this.orderService.increaseQuantity(orderDetailIndex);
    }

    decreaseQuantity(orderDetailIndex) {
        this.orderService.decreaseQuantity(orderDetailIndex);
    }

    removeOrderDetail(orderDetailIndex) {
        this.orderService.removeOrderDetail(orderDetailIndex);
    }

    cancelOrder() {
        this.orderService.setOrder(null);
        this.router.navigate(['menu']);
    }
}
