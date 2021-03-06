import {Injectable} from '@angular/core';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite/ngx';
import {Product} from '../_models/product';
import {Client} from '../_models/client';
import {Category} from '../_models/category';
import {OrderService} from './order.service';

@Injectable({
    providedIn: 'root'
})
export class ClientService {
    private client: Client;
    private db: SQLiteObject;
    private isOpen: boolean;

    constructor(private sqlStorage: SQLite,
                private orderService: OrderService) {
    }

    public setClient(client) {
        this.client = client;
        if (client) {
            this.orderService.setDiscount(client.discount);
        } else {
            this.orderService.setDiscount(0);
        }

    }

    public getClient() {
        return this.client;
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

    async getClients(lastId, limit: number = 1) {
        await this.connect();
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM clients WHERE id >= ' + lastId + ' ORDER BY id LIMIT ' + limit;
            this.db.executeSql(sql, []).then((data) => {
                const clients: Client[] = [];
                if (data.rows.length > 0) {
                    for (let i = 0; i < data.rows.length; i++) {
                        const client = new Client(
                            data.rows.item(i).id,
                            data.rows.item(i).name,
                            data.rows.item(i).email,
                            data.rows.item(i).discount,
                            data.rows.item(i).address
                        );
                        clients.push(client);
                    }
                }
                resolve(clients);
            }, (error) => {
                console.log(error);
                reject(error);
            });
        });

    }
}
