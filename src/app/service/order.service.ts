import {Injectable} from '@angular/core';
import {Order} from '../_models/order';
import * as _ from 'lodash';
import {BehaviorSubject} from 'rxjs';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite/ngx';
import {Client} from '../_models/client';
import {OrderDetail} from '../_models/order-detail';
import {Product} from '../_models/product';
import {Option} from '../_models/option';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    order: Order;
    total = new BehaviorSubject(0);
    quantity = new BehaviorSubject(0);
    discount = new BehaviorSubject(0);
    grandTotal = new BehaviorSubject(0);
    private db: SQLiteObject;
    private isOpen: boolean;

    constructor(private sqlStorage: SQLite) {
    }

    setOrder(order: Order) {
        this.order = order;
        if (this.order) {
            order.date = new Date().toLocaleDateString();
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

    private async connect() {
        if (!this.isOpen) {
            this.sqlStorage = new SQLite();
            await this.sqlStorage.create({name: 'pos.db', location: 'default'}).then((db: SQLiteObject) => {
                this.db = db;
                this.isOpen = true;

            }).catch((error) => {

            });
        }
    }

    public async createOrder() {
        await this.connect();
        // creating order first
        return new Promise(async (resolve, reject) => {
            await this.insertOrder().then(async () => {
                // find the latest order id
                const lastOrderId = await this.getLastOrderId();
                // store order details
                for (let i = 0; i < this.order.orderDetails.length; i++) {
                    if (this.order.orderDetails[i].option) {
                        // store option and product id
                        await this.storeOrderDetailWithOption(
                            lastOrderId,
                            this.order.orderDetails[i].option,
                            this.order.orderDetails[i].product,
                            this.order.orderDetails[i].quantity
                        );
                    } else {
                        // store only product id
                        console.log('no option');
                        await this.storeOrderDetailWithNoOption(
                            lastOrderId,
                            this.order.orderDetails[i].product,
                            this.order.orderDetails[i].quantity
                        );
                    }
                }
                resolve(lastOrderId);
            }).catch((error) => {
                console.log(error);
            });
        });

        // return new Promise((resolve, reject) => {
        //    const orderSql = ""
        // });
    }

    private async insertOrder() {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO orders (client_id, total, discount, date) ' +
                'VALUES (?,?,?,?)';
            this.db.executeSql(sql, [
                this.order.client.id,
                this.order.total,
                this.order.discount,
                this.order.date
            ])
                .then((success) => {
                    resolve(success);
                }, (error) => {
                    console.log('order create error ');
                    reject(error);
                });
        });
    }

    private async getLastOrderId() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT MAX(id) as id FROM orders';
            this.db.executeSql(sql, [])
                .then((data) => {
                    if (data.rows.length > 0) {
                        console.log('order id');
                        console.log(data.rows.item(0).id);
                    }
                    resolve(data.rows.item(0).id);
                }, (error) => {
                    console.log('last order id error');
                    reject(error);
                });
        });
    }

    private async storeOrderDetailWithOption(orderId, option, product, quantity) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO order_details (order_id, option_id, product_id, price, quantity) ' +
                'VALUES (?,?,?,?,?)';
            this.db.executeSql(sql, [orderId, option.id, product.id, option.price, quantity])
                .then((success) => {
                    resolve(success);
                }, (error) => {
                    console.log('order detail create error with option');
                    reject(error);
                });
        });
    }

    private async storeOrderDetailWithNoOption(orderId, product, quantity) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO order_details (order_id, product_id, price, quantity) ' +
                'VALUES (?,?,?,?)';
            this.db.executeSql(sql, [orderId, product.id, product.salePrice, quantity])
                .then((success) => {
                    resolve(success);
                }, (error) => {
                    console.log('order detail create error with no option');
                    reject(error);
                });
        });
    }

    public async getOrdersFromDB(orderId: number = 0, customerName: string = '', limit: number = 20) {
        await this.connect();
        let sql = 'SELECT orders.id as orderId,' +
            'orders.total,' +
            'orders.discount as orderDiscount,' +
            'orders.date,' +
            'clients.id as clientId,' +
            'clients.name,' +
            'clients.email,' +
            'clients.phone,' +
            'clients.discount as clientDiscount,' +
            'clients.address ' +
            'FROM orders ' +
            'JOIN clients ON clients.id = orders.client_id ';
        return new Promise((resolve, reject) => {
            const orderCollection: Order[] = [];
            if (customerName.length > 0) {
                sql = sql + 'WHERE clients.name LIKE \'%' + customerName + '%\' AND orders.id > ' + orderId + ' LIMIT ' + limit;
            } else {
                sql = sql + 'WHERE orders.id > ' + orderId + ' LIMIT ' + limit;
            }
            this.db.executeSql(sql, []).then((data) => {
                if (data.rows.length > 0) {
                    for (let i = 0; i < data.rows.length; i++) {
                        const order = new Order(
                            data.rows.item(i).date,
                            data.rows.item(i).orderDiscount,
                            data.rows.item(i).total,
                            null,
                            null
                        );
                        order.id = data.rows.item(i).orderId;
                        order.clientId = data.rows.item(i).clientId;
                        const orderClient = new Client(
                            data.rows.item(i).clientId,
                            data.rows.item(i).name,
                            data.rows.item(i).email,
                            data.rows.item(i).clientDiscount,
                            data.rows.item(i).address,
                        );
                        order.client = orderClient;
                        orderCollection.push(order);
                    }
                }
                resolve(orderCollection);
            }).catch((error) => {
                console.log('order fetching error');
                console.log(error);
                reject(error);
            });
        });

    }

    public async getOrderDetails(orderId: number) {
        await this.connect();
        console.log('in order details');
        const sql = 'SELECT order_details.id as detailsId,' +
            'order_details.option_id as optionId,' +
            'order_details.order_id as orderId,' +
            'order_details.product_id as productId,' +
            'order_details.price as detailsPrice,' +
            'order_details.quantity as detailsQuantity,' +
            'products.name as productName,' +
            'products.description as productDescription,' +
            'options.id as optionId,' +
            'options.type as optionType,' +
            'options.price as optionPrice ' +
            'FROM order_details ' +
            'JOIN products ON products.id = order_details.product_id ' +
            'LEFT JOIN options ON options.product_id = products.id ' +
            'WHERE order_details.order_id = ' + orderId;

        return new Promise((resolve, reject) => {
            const orderDetails: OrderDetail [] = [];
            this.db.executeSql(sql, []).then((data) => {
                if (data.rows.length > 0) {
                    for (let i = 0; i < data.rows.length; i++) {
                        const option = new Option(
                            data.rows.item(i).optionId,
                            data.rows.item(i).productId,
                            data.rows.item(i).optionType,
                            data.rows.item(i).optionPrice,
                        );
                        const product = new Product(
                            data.rows.item(i).productId,
                            '',
                            data.rows.item(i).productName,
                            0,
                            0,
                            data.rows.item(i).productDescription,
                            0,
                            0,
                            ''
                        );
                        const orderDetail = new OrderDetail(
                            option,
                            product,
                            data.rows.item(i).detailsPrice,
                            data.rows.item(i).detailsQuantity
                        );
                        orderDetail.productId = data.rows.item(i).productId;
                        orderDetail.optionId = data.rows.item(i).optionId;
                        orderDetails.push(orderDetail);
                    }
                }
                resolve(orderDetails);
            }).catch((error) => {
                console.log('order details error');
                console.log(error);
                reject(error);
            });
        });
    }

}
