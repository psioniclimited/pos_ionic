import {Injectable} from '@angular/core';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite/ngx';
import {Order} from '../_models/order';
import {OrderDetail} from '../_models/order-detail';
import {ENV} from '../_config/config';
import {AuthService} from './auth.service';
import {HTTP} from '@ionic-native/http/ngx';
import {Platform} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class SyncService {
    private db: SQLiteObject;
    private isOpen: boolean;
    orderCollection: Order[];
    orderListCollection = false;
    syncAPI = ENV.API_ENDPOINT + '/mobileapi/order';
    private token = '';
    serverErrorCode = 0;

    constructor(private sqlStorage: SQLite,
                private authService: AuthService,
                private http: HTTP,
                private platform: Platform) {

        this.platform.ready().then(async () => {
            await this.getToken();
        });
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
                // console.log('length ==============');
                // console.log(data);
                length = data;
            });
            if (length !== 0) {
                const isDataSent = await this.sendOrderCollectionTOServer().then().catch((error) => {
                    console.log(error);
                });
                if (isDataSent) {
                    for (let i = 0; i < this.orderCollection.length; i++) {
                        console.log('deleting order details');
                        await this.deleteOrderDetail(this.orderCollection[i].id);
                        console.log('deleting orders');
                        await this.deleteOrder(this.orderCollection[i].id);
                    }
                } else {
                    console.log('data sent not deleting');
                }
                // if data sent delete data
            } else {
                if (this.orderListCollection && lastOderId > 20) {
                    await this.resetOrderDetails();
                    await this.resetOrders();
                }
                console.log('sync done =======');
                break;
            }
        }
    }

    private async getOrders(orderId) {
        this.orderCollection.splice(0, this.orderCollection.length);
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM orders where id > ' + orderId + ' LIMIT 20';
            this.db.executeSql(sql, [])
                .then(async (data) => {
                    if (data.rows.length > 0) {
                        this.orderListCollection = true;
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
                    } else {
                        this.orderListCollection = false;
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
                            const orderDetail = new OrderDetail(
                                null,
                                null,
                                data.rows.item(i).price,
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

    private async sendOrderCollectionTOServer() {
        const headers = {
            Authorization: 'Bearer ' + this.token
        };

        return new Promise((resolve, reject) => {
            this.http.post(this.syncAPI, {data: this.orderCollection}, headers).then(async (res) => {
                console.log('server response');
                console.log(res);
                resolve(true);
            }, (error) => {
                this.serverErrorCode = error.status;
                console.log('server error');
                console.log(error);
                reject(false);
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

    private async getToken() {
        await this.authService.getToken().then((data) => {
            this.token = data;
        }).catch((error) => {
            console.log('token fetch error');
            console.log(error);
        });
    }

    private async deleteOrderDetail(id: number) {
        // deleting order_details
        const orderDetailsSql = 'DELETE FROM order_details WHERE order_id = ?';
        return new Promise((resolve, reject) => {
            this.db.executeSql(orderDetailsSql, [id]).then((data) => {
                resolve(data);
            }).catch((error) => {
                console.log(error);
                reject(error);
            });
        });
    }

    private async deleteOrder(id: number) {
        const sql = 'DELETE FROM orders WHERE id = ?';
        return new Promise((resolve, reject) => {
            this.db.executeSql(sql, [id]).then((data) => {
                resolve(data);
            }).catch((error) => {
                console.log(error);
                reject(error);
            });
        });
    }

    private async resetOrderDetails() {
        const sql = 'DELETE FROM SQLITE_SEQUENCE WHERE NAME = ?';
        return new Promise((resolve, reject) => {
            this.db.executeSql(sql, ['order_details']).then((data) => {
                resolve(data);
            }, (error) => {
                reject(error);
            });
        });
    }

    private async resetOrders() {
        const sql = 'DELETE FROM SQLITE_SEQUENCE WHERE NAME = ?';
        return new Promise((resolve, reject) => {
            this.db.executeSql(sql, ['orders']).then((data) => {
                resolve(data);
            }, (error) => {
                reject(error);
            });
        });
    }
}
