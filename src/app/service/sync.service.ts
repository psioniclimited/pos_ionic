import {Injectable} from '@angular/core';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite/ngx';
import {Order} from '../_models/order';
import {OrderDetail} from '../_models/order-detail';

@Injectable({
    providedIn: 'root'
})
export class SyncService {
    private db: SQLiteObject;
    private isOpen: boolean;
    orderCollection: Order[];
    orderListCollection = false;

    constructor(private sqlStorage: SQLite) {
    }

    async syncData() {
        this.orderCollection = [];
        this.orderListCollection = false;
        await this.connect();
        while (true) {
            let lastOderId = 0;
            if (this.orderCollection.length > 0) {
                lastOderId = this.orderCollection[this.orderCollection.length - 1].id;
            }
            let length: any = 0;
            await this.getOrders(lastOderId).then((data) => {
                console.log('length ==============');
                console.log(data);
                length = data;
            });
            if (length !== 0) {
                // send to server
                for (let i = 0; i < this.orderCollection.length; i++) {
                    console.log(this.orderCollection[i]);
                }
                // if data sent delete data
            } else {
                if (this.orderListCollection) {
                    // reset auto increment
                }
                break;
            }

        }
    }

    private async getOrders(orderId) {
        console.log('in the getOrder');
        this.orderCollection.splice(0, this.orderCollection.length);
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM orders where id > ' + orderId + ' LIMIT 20';
            this.db.executeSql(sql, [])
                .then(async (data) => {
                    if (data.rows.length > 0) {
                        for (let i = 0; i < data.rows.length; i++) {
                            const order = new Order(
                                data.rows.item(i).date,
                                data.rows.item(i).discount,
                                data.rows.item(i).total,
                                [],
                                null,
                            );
                            // data.rows.item(i).id,
                            // data.rows.item(i).client_id,
                            order.id = data.rows.item(i).id;
                            order.clientId = data.rows.item(i).client_id;
                            // get order details
                            await this.getOrderDetails(order);
                            this.orderCollection.push(order);
                        }
                    }
                    resolve(this.orderCollection.length);
                }, (error) => {
                    // console.log('customer create error ' + error);
                    reject(error);
                });
        });
    }

    private async getOrderDetails(order) {
        const orderId = order.id;
        const orderDetailCollection: OrderDetail[] = [];
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM order_details where order_id = ' + orderId;
            this.db.executeSql(sql, [])
                .then(async (data) => {
                    if (data.rows.length > 0) {
                        for (let i = 0; i < data.rows.length; i++) {
                            // data.rows.item(i).date,
                            const orderDetail = new OrderDetail(
                                null,
                                null,
                                data.rows.item(i).total,
                                data.rows.item(i).quantity,
                            );
                            orderDetail.productId = data.rows.item(i).product_id;
                            orderDetail.optionId = data.rows.item(i).option_id;
                            // get order details
                            orderDetailCollection.push(orderDetail);
                        }
                    }
                    order.orderDetails = orderDetailCollection;
                    resolve('success');
                }, (error) => {
                    // console.log('customer create error ' + error);
                    reject(error);
                });
        });

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
}
