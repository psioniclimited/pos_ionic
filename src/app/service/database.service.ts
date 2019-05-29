import {Injectable} from '@angular/core';
import {Platform} from '@ionic/angular';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite/ngx';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {

    private database: SQLiteObject;
    private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(private plt: Platform,
                private sqlite: SQLite) {
        this.plt.ready().then(() => {
            this.sqlite.create({
                name: 'pos.db',
                location: 'default'
            }).then((db: SQLiteObject) => {
                this.database = db;
                this.seed().catch();
            });
        });
    }

    public async seed() {
        // create categories
        await this.createCategoriesTable();
        await this.createProductsTable();
        await this.createAddons();
        await this.createOptions();
        await this.createClient();
        await this.createOrders();
        await this.createOrderDetails();
        this.dbReady.next(true);
    }

    public async unseed() {
        await this.deleteCategories();
        await this.deleteProducts();
        await this.deleteAddons();
        await this.deleteOptions();
        await this.deleteClients();
        await this.deleteOrders();
        await this.deleteOrderDetails();
    }

    private async createCategoriesTable() {
        const sql = 'CREATE TABLE IF NOT EXISTS categories' +
            '(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,' +
            'name VARCHAR(255), ' +
            'description VARCHAR(255))';

        this.database.executeSql(sql, []).then().catch((error) => {
            console.log('categories not created');
            console.log(error);
        });
    }

    private async createProductsTable() {
        // test
        const sql = 'CREATE TABLE IF NOT EXISTS products' +
            '(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,' +
            'name VARCHAR(255), ' +
            'category_id INTEGER NOT NULL, ' +
            'cost DECIMAL(15,2), ' +
            'has_addons  TINYINT(1), ' +
            'has_options  TINYINT(1), ' +
            'sale_price  DECIMAL(15,2), ' +
            'description VARCHAR(255), ' +
            'price_tag VARCHAR(255), ' +
            'FOREIGN KEY (category_id) REFERENCES categories(id))';

        this.database.executeSql(sql, []).then().catch((error) => {
            console.log('products not created');
            console.log(error);
        });
    }

    private async createAddons() {

        const sql = 'CREATE TABLE IF NOT EXISTS addons' +
            '(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,' +
            'product_id INTEGER NOT NULL,' +
            'name VARCHAR(255),' +
            'price DECIMAL(15,2),' +
            'FOREIGN KEY (product_id) REFERENCES products(id))';

        this.database.executeSql(sql, []).then().catch((error) => {
            console.log('addons not created');
            console.log(error);
        });
    }

    private async createOptions() {
        const sql = 'CREATE TABLE IF NOT EXISTS options' +
            '(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,' +
            'product_id INTEGER NOT NULL,' +
            'type VARCHAR(255), ' +
            'price DECIMAL(15,2),' +
            'FOREIGN KEY (product_id) REFERENCES products(id))';

        this.database.executeSql(sql, []).then().catch((error) => {
            console.log('options not created');
            console.log(error);
        });
    }

    private async createClient() {
        const sql = 'CREATE TABLE IF NOT EXISTS clients' +
            '(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,' +
            'name VARCHAR(255), ' +
            'email VARCHAR(255),' +
            'phone DECIMAL(15,2),' +
            'discount DECIMAL(15,2),' +
            'address VARCHAR(255))';

        this.database.executeSql(sql, []).then().catch((error) => {
            console.log('clients not created');
            console.log(error);
        });
    }

    private async createOrders() {
        const sql = 'CREATE TABLE IF NOT EXISTS orders' +
            '(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,' +
            'client_id INTEGER NOT NULL, ' +
            'total DECIMAL(15,2),' +
            'discount DECIMAL(15,2),' +
            'date DATE,' +
            'FOREIGN KEY (client_id) REFERENCES clients(id))';

        this.database.executeSql(sql, []).then().catch((error) => {
            console.log('orders not created');
            console.log(error);
        });
    }

    private async createOrderDetails() {
        const sql = 'CREATE TABLE IF NOT EXISTS order_details' +
            '(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,' +
            'order_id INTEGER NOT NULL,' +
            'option_id INTEGER,' +
            'product_id INTEGER,' +
            'price DECIMAL(15,2),' +
            'quantity DECIMAL(15,2),' +
            'FOREIGN KEY (order_id) REFERENCES orders(id),' +
            'FOREIGN KEY (option_id) REFERENCES options(id),' +
            'FOREIGN KEY (product_id) REFERENCES products(id))';

        this.database.executeSql(sql, []).then().catch((error) => {
            console.log('order_details not created');
            console.log(error);
        });
    }

    private async deleteCategories() {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM categories';
            this.database.executeSql(sql, []).then((data) => {
                console.log('deleting categories');
                resolve(data);
            }, (error) => {
                reject(error);
            });
        });
    }

    private async deleteProducts() {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM products';
            this.database.executeSql(sql, []).then((data) => {
                resolve(data);
            }, (error) => {
                reject(error);
            });
        });
    }

    private async deleteAddons() {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM addons';
            this.database.executeSql(sql, []).then((data) => {
                resolve(data);
            }, (error) => {
                reject(error);
            });
        });
    }

    private async deleteOptions() {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM options';
            this.database.executeSql(sql, []).then((data) => {
                resolve(data);
            }, (error) => {
                reject(error);
            });
        });
    }

    private async deleteClients() {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM clients';
            this.database.executeSql(sql, []).then((data) => {
                resolve(data);
            }, (error) => {
                reject(error);
            });
        });
    }

    private async deleteOrders() {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM orders';
            this.database.executeSql(sql, []).then((data) => {
                resolve(data);
            }, (error) => {
                reject(error);
            });
        });
    }

    private async deleteOrderDetails() {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM order_details';
            this.database.executeSql(sql, []).then((data) => {
                resolve(data);
            }, (error) => {
                reject(error);
            });
        });
    }
}
