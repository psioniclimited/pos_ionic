import {Injectable} from '@angular/core';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite/ngx';
import {BehaviorSubject, Subject} from 'rxjs';
import {Product} from '../_models/product';
import {Option} from '../_models/option';
import {Addon} from '../_models/addon';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private db: SQLiteObject;
    private isOpen: boolean;
    selectedCategory = new BehaviorSubject<string>('0');

    constructor(private sqlStorage: SQLite) {
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

    public setCategory(data) {
        this.selectedCategory.next(data);
    }

    public async getProducts(categoryId) {
        await this.connect();
        let sql;
        const products: Product[] = [];
        let options: Option[];
        let addons: Addon[];
        if (categoryId === '0') {
            sql = 'SELECT * FROM products ORDER BY category_id';
        } else {
            sql = 'SELECT * FROM products WHERE category_id = ' + categoryId + ' ORDER BY category_id';
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
                            data.rows.item(i).price_tag,
                        );
                        if (product.hasOptions === 1) {
                            // need to query options
                            options = [];
                            const queryOptions = 'SELECT * FROM options WHERE product_id = ' + product.id;
                            await this.db.executeSql(queryOptions, []).then((res) => {
                                if (res.rows.length > 0) {
                                    for (let j = 0; j < res.rows.length; j++) {
                                        const option = new Option(
                                            res.rows.item(j).id,
                                            res.rows.item(j).product_id,
                                            res.rows.item(j).type,
                                            res.rows.item(j).price,
                                        );
                                        options.push(option);
                                    }
                                }
                            }).catch((error) => {
                                console.log(error);
                            });
                            product.options = options;
                        }
                        if (product.hasAddons === 1) {
                            // query addons
                            addons = [];
                            const queryOptions = 'SELECT * FROM addons WHERE product_id = ' + product.id;
                            await this.db.executeSql(queryOptions, []).then((res) => {
                                if (res.rows.length > 0) {
                                    for (let j = 0; j < res.rows.length; j++) {
                                        const addon = new Addon(
                                            res.rows.item(j).name,
                                            res.rows.item(j).price,
                                        );
                                        addon.productId = res.rows.item(j).product_id;
                                        addon.id = res.rows.item(j).id;
                                        addons.push(addon);
                                    }
                                }
                            }).catch((error) => {
                                // console.log('error in query addons');
                                console.log(error);
                            });
                        }
                        product.addons = addons;
                        products.push(product);
                    }
                }
                resolve(products);
            }, (error) => {
                console.log('error in query products');
                reject(error);
            });
        });

    }
}
