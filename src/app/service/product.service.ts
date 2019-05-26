import {Injectable} from '@angular/core';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite/ngx';
import {BehaviorSubject} from 'rxjs';
import {Product} from '../_models/product';
import {Option} from '../_models/option';

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
        await this.start();
        let sql;
        const products: Product[] = [];
        let options: Option[];
        if (categoryId === null || categoryId === 'all') {
            sql = 'SELECT * FROM products ORDER BY id';
        } else {
            sql = 'SELECT * FROM products WHERE category_id = ' + categoryId + ' ORDER BY id';
        }
        return new Promise((resolve, reject) => {
            this.db.executeSql(sql, []).then(async (data) => {
                if (data.rows.length > 0) {
                    for (let i = 0; i < data.rows.length; i++) {
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
                        if (product.hasOptions === 1) {
                            // need to query options
                            options = [];
                            const queryOptions = 'SELECT * FROM options WHERE product_id = ' + product.id;
                            this.db.executeSql(queryOptions, []).then((res) => {
                                if (res.rows.length > 0) {
                                    for (let j = 0; j < res.rows.length; j++) {
                                        const option = new  Option(
                                            res.rows.item(j).id,
                                            res.rows.item(j).product_id,
                                            res.rows.item(j).type,
                                            res.rows.item(j).price,
                                        );
                                        options.push(option);
                                    }
                                }
                            }).catch((error) => {
                                console.log('query products did not happen');
                                console.log(error);
                            });
                            product.options = options;
                        }
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
