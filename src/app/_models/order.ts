import {OrderDetail} from './order-detail';
import {Client} from './client';

export class Order {
    date: Date;
    discount: number;
    total: number;
    orderDetails: OrderDetail[];
    client: Client;

    constructor(date: Date = new Date(),
                discount: number = 0,
                total: number = 0,
                orderDetails: OrderDetail[] = [],
                client: Client = new Client()) {
        this.date = date;
        this.discount = discount;
        this.total = total;
        this.orderDetails = orderDetails;
        this.client = client;
    }
}
