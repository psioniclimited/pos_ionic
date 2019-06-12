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
            this.checkToken();
        });
    }

    login(creds: Creds): any {
        return this.http.post(this.apiUrl, creds, {}).then(data => {
            const response = JSON.parse(data.data);
            this.storage.setItem('TOKEN', response.token).then(() => {
                this.authenticationState.next(true);
            });
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

    getToken() {
        return this.storage.getItem('TOKEN');
    }

    async removeToken() {
        await this.storage.clear().then(() => {
            console.log('storage clear ====');
        }).catch((error) => {
            console.log(error);
        });
    }

    isAuthenticated() {
        return this.authenticationState.value;
    }
}
