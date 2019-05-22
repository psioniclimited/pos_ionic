import {Injectable} from '@angular/core';
import {DatabaseService} from './database.service';
import {Platform} from '@ionic/angular';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite/ngx';
import {ENV} from '../_config/config';
import {AuthService} from './auth.service';
import {HTTP} from '@ionic-native/http/ngx';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private db: SQLiteObject;
    private isOpen: boolean;
    // need to change this url
    private categoryUrl = ENV.API_ENDPOINT + '/category';
    private productUrl = ENV.API_ENDPOINT + '/product';
    private categoryId = [];
    private token = '';

    constructor(private platform: Platform,
                public sqlStorage: SQLite,
                private authService: AuthService,
                private http: HTTP,
                private databaseService: DatabaseService) {

        this.platform.ready().then(() => {

            if (!this.isOpen) {
                this.sqlStorage = new SQLite();
                this.sqlStorage.create({name: 'pos.db', location: 'default'}).then((db: SQLiteObject) => {
                    this.db = db;
                    this.isOpen = true;

                }).catch((error) => {

                });
            }

        });
        this.getToken();
    }

    public async index() {
        await this.databaseService.unseed().catch((error) => {
            console.log(error);
        });
        const headers = {
            Authorization: 'Bearer ' + this.token
        };

        const params = {
            per_page: '3',
            page: '1'
        };
        while (true) {
            const httpRequest = await this.fetchCategory(params, headers);
            if (httpRequest == null) {
                break;
            }
            params.page = httpRequest.toString();
        }
        // Get all categories
        for (let i = 0; i < this.categoryId.length; i++) {
            const productParams = {
                per_page: '3',
                page: '1',
                category_id: this.categoryId[i] + ''
            };
            // call products api using the category ids
            while (true) {
                const productRequest = await this.fetchProducts(productParams, headers);
                if (productRequest == null) {
                    break;
                }
                productParams.page = productRequest.toString();
            }

        }
    }

    private async fetchCategory(params: any, headers: any) {
        return new Promise((resolve, reject) => {
            this.http.get(this.categoryUrl, params, headers).then(async (data) => {
                const categories = JSON.parse(data.data);
                for (let i = 0; i < categories.data.length; i++) {
                    this.categoryId.push(categories.data[i].id);
                    await this.createCategory(categories.data[i]).then((res) => {
                    }, (error) => {
                        console.log(error);
                    });
                }
                console.log(categories.next_page_url);
                if (categories.next_page_url != null) {
                    const page = categories.current_page + 1;
                    resolve(page);
                }
                resolve(null);
            }, (error) => {
                // console.log('error  in fetching data');
                // console.log(error);
                reject(error);
            });
        });
    }

    // fetching products form the server
    private async fetchProducts(params: any, headers: any) {
        return new Promise((resolve, reject) => {
            this.http.get(this.productUrl, params, headers).then(async (data) => {
                const products = JSON.parse(data.data);
                console.log(products);
                for (let i = 0; i < products.data.length; i++) {
                    await this.createProduct(products.data[i]).then(async (res) => {
                        console.log('addons========');
                        console.log(products.data[i].addons);
                        // creating addons
                        if (products.data[i].addons.length > 0) {
                            for (let j = 0; j < products.data[i].addons.length; j++) {
                                await this.createAddon(products.data[i].addons[j]).then().catch(error => {
                                    console.log(error);
                                });
                            }
                        }
                        // creating options
                        if (products.data[i].options.length > 0) {
                            for (let j = 0; j < products.data[i].options.length; j++) {
                                await this.createOption(products.data[i].options[j]).then().catch(error => {
                                    console.log(error);
                                });
                            }
                        }
                    }, (error) => {
                        console.log(error);
                    });
                }
                console.log(products.next_page_url);
                if (products.next_page_url != null) {
                    const page = products.current_page + 1;
                    resolve(page);
                }
                resolve(null);
            }, (error) => {
                // console.log('error  in fetching data');
                // console.log(error);
                reject(error);
            });
        });
    }

    // Create the category
    private async createCategory(data: any) {
        // console.log('customer id ' + data.id);
        return new Promise(((resolve, reject) => {
            const sql = 'INSERT INTO categories (id, name, description) ' +
                'VALUES (?,?,?)';
            this.db.executeSql(sql, [data.id, data.name, data.description])
                .then((success) => {
                    resolve(success);
                }, (error) => {
                    // console.log('customer create error ' + error);
                    reject(error);
                });
        }));
    }

    // Create the product
    private async createProduct(data: any) {
        // console.log('customer id ' + data.id);
        return new Promise(((resolve, reject) => {
            const sql = 'INSERT INTO products (id, name, category_id, cost, has_addons, has_options, sale_price, description) ' +
                'VALUES (?,?,?,?,?,?,?,?)';
            this.db.executeSql(sql, [data.id, data.name, data.cost, data.has_addons, data.has_options, data.sale_price, data.description])
                .then((success) => {
                    resolve(success);
                }, (error) => {
                    // console.log('customer create error ' + error);
                    reject(error);
                });
        }));
    }

    // Create the addon
    private async createAddon(data: any) {
        // console.log('customer id ' + data.id);
        return new Promise(((resolve, reject) => {
            const sql = 'INSERT INTO addons (id, product_id, name, price) ' +
                'VALUES (?,?,?,?)';
            this.db.executeSql(sql, [data.id, data.product_id, data.name, data.price])
                .then((success) => {
                    resolve(success);
                }, (error) => {
                    // console.log('customer create error ' + error);
                    console.log('addons not created');
                    reject(error);
                });
        }));
    }

    // Create the option
    private async createOption(data: any) {
        // console.log('customer id ' + data.id);
        return new Promise(((resolve, reject) => {
            const sql = 'INSERT INTO options (id, product_id, type, price) ' +
                'VALUES (?,?,?,?)';
            this.db.executeSql(sql, [data.id, data.product_id, data.type, data.price])
                .then((success) => {
                    resolve(success);
                }, (error) => {
                    // console.log('customer create error ' + error);
                    reject(error);
                });
        }));
    }

    getToken() {
        this.authService.getToken().then((data) => {
            this.token = data;
        }).catch((error) => {
            console.log('token fetch error');
            console.log(error);
        });
    }
}
