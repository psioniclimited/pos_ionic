import {Injectable} from '@angular/core';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite/ngx';
import {BehaviorSubject} from 'rxjs';
import {Product} from '../_models/product';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private db: SQLiteObject;
    private isOpen: boolean;
    selectedCategory = new BehaviorSubject<string>(null);

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
    }

    public setCategory(data) {
        this.selectedCategory.next(data);
    }

    public async getProducts(categoryId) {
        this.start();
        let sql;
        if (categoryId === 'all') {
            sql = 'SELECT * FROM products ORDER BY id';
        } else {
            sql = 'SELECT * FROM products WHERE category_id = ' + categoryId + ' ORDER BY id';
        }
        console.log('sql ====');
        console.log(sql);
        return new Promise((resolve, reject) => {
            const products: Product[] = [];
            this.db.executeSql(sql, []).then((data) => {
                if (data.rows.length > 0) {
                    for (let i = 0; i < data.rows.length; i++) {
                        console.log(data.rows.item(i));
                        const product = new Product(
                            data.rows.item(i).id,
                            data.rows.item(i).category_id,
                            data.rows.item(i).name,
                            data.rows.item(i).cost,
                            data.rows.item(i).sale_price,
                            data.rows.item(i).description,
                            data.rows.item(i).has_addons,
                            data.rows.item(i).has_options,
                        );
                        products.push(product);
                    }
                }
                console.log(products);
                resolve(products);
            }, (error) => {
                console.log('error in query products');
                reject(error);
            });
        });

    }
}
