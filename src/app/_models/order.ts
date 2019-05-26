import {OrderDetail} from './order-detail';

export class Order {
    date: Date;
    discount: number;
    total: number;
    orderDetails: OrderDetail[];


    constructor(date: Date = new Date(), discount: number = 0, total: number = 0, orderDetails: OrderDetail[] = []) {
        this.date = date;
        this.discount = discount;
        this.total = total;
        this.orderDetails = orderDetails;
    }
}
