import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {HTTP} from '@ionic-native/http/ngx';
import {Platform} from '@ionic/angular';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {Creds} from '../_models/Creds';
import {ENV} from '../_config/config';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    authenticationState = new BehaviorSubject(false);
    apiUrl = ENV.API_ENDPOINT + 'mobileapi/login';

    constructor(private http: HTTP, private storage: NativeStorage, private plt: Platform) {
        this.plt.ready().then(() => {
            // this.checkToken();
        });
    }

    login(creds: Creds): any {
        return this.http.post(this.apiUrl, creds, {}).then(async (data) => {
            const response = JSON.parse(data.data);
            await this.storeToken(response);
            return response;
        })
            .catch(error => {
                this.authenticationState.next(false);
                console.log('server error');
                console.log(error);
                return error.status;
            });
    }

    async checkToken() {
        await this.storage.getItem('TOKEN').then(res => {
            if (res) {
                this.authenticationState.next(true);
            }
        });
    }

    async storeToken(token) {
        await this.storage.setItem('TOKEN', token).then((res) => {
            console.log('token stored');
            console.log(res);
            this.authenticationState.next(true);
        }).catch((error) => {
            console.log(error);
        });
    }

    async getToken() {
        return await this.storage.getItem('TOKEN');
    }

    async removeToken() {
        await this.storage.remove('TOKEN').then((res) => {
            console.log('token removed');
        }).catch((error) => {
            console.log(error);
        });

        await this.storage.keys().then((res) => {
            console.log(res);
        }).catch((error) => {
            console.log(error);
        });

    }

    isAuthenticated() {
        return this.authenticationState.value;
    }
}
