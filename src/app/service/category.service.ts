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
    private api_url = ENV.API_ENDPOINT + '/category';
    private token = '';

    constructor(private databaseService: DatabaseService,
                private platform: Platform,
                public sqlStorage: SQLite,
                private authService: AuthService,
                private http: HTTP) {

        this.platform.ready().then(() => {

            if (!this.isOpen) {
                this.sqlStorage = new SQLite();
                this.sqlStorage.create({name: 'data.db', location: 'default'}).then((db: SQLiteObject) => {
                    this.db = db;
                    this.isOpen = true;

                }).catch((error) => {

                });
            }

        });
        this.getToken();
    }

    public async index() {
        const headers = {
            Authorization: 'Bearer ' + this.token
        };
        let httpRequest = await this.fetchData(headers);
    }

    getToken() {
        this.authService.getToken().then((data) => {
            this.token = data;
        }).catch((error) => {
            console.log('token fetch error');
            console.log(error);
        });
    }

    private async fetchData(headers: any) {
        return new Promise((resolve, reject) => {
            this.http.get(this.api_url, '', headers).then(async (data) => {
                const response = JSON.parse(data.data);
                console.log(response);
                // for (let i = 0; i < response.data.length; i++) {
                // }
                resolve(response.data.length);
            }, (error) => {
                // console.log('error  in fetching data');
                // console.log(error);
                reject(error);
            });
        });
    }

}
