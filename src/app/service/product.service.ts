import {Injectable} from '@angular/core';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite/ngx';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private db: SQLiteObject;
    private isOpen: boolean;

    constructor(private sqlStorage: SQLite) {
    }

    private async start() {
        if (!this.isOpen) {
            this.sqlStorage = new SQLite();
            await this.sqlStorage.create({name: 'pos.db', location: 'default'}).then((db: SQLiteObject) => {
                console.log('sdfkjsdfljksdf');
                this.db = db;
                this.isOpen = true;

            }).catch((error) => {

            });
        }
        console.log('=============');
        console.log(this.isOpen);
    }

    public  async getProducts() {
        this.start();
        const sql = 'SELECT * FROM products WHERE id > ? LIMIT 30';
    }
}
