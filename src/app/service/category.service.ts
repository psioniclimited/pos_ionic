import {Injectable} from '@angular/core';
import {Platform} from '@ionic/angular';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite/ngx';
import {AuthService} from './auth.service';
import {HTTP} from '@ionic-native/http/ngx';
import {DatabaseService} from './database.service';
import {Category} from '../_models/category';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {

    private db: SQLiteObject;
    private isOpen: boolean;

    constructor(private platform: Platform,
                private sqlStorage: SQLite,
                private authService: AuthService,
                private http: HTTP,
                private databaseService: DatabaseService) {
        this.platform.ready().then(() => {
        });
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

    public async queryCategories() {
        await this.start();
        console.log('in the queryCategories');
        // return new promise
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM categories';
            this.db.executeSql(sql, []).then((data) => {
                const categories: Category [] = [];
                if (data.rows.length > 0) {
                    for (let i = 0; i < data.rows.length; i++) {
                        const category = new Category(
                            data.rows.item(i).id,
                            data.rows.item(i).name,
                            data.rows.item(i).description
                        );
                        categories.push(category);
                    }
                }
                console.log(categories);
                resolve(categories);
            }, (error) => {
                console.log(error);
                reject(error);
            });
        });

    }
}