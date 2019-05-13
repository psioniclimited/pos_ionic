import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {HTTP} from '@ionic-native/http/ngx';
import {Platform} from '@ionic/angular';
import {NativeStorage} from '@ionic-native/native-storage/ngx';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    authenticationState = new BehaviorSubject(false);

    constructor(private http: HTTP, private storage: NativeStorage, private plt: Platform) {
        this.plt.ready().then(() => {
            this.checkToken();
        });
    }

    login(creds: Creds): any {
        return this.http.post('http://192.168.0.121:8000/user/login', creds, {}).then(data => {
            return JSON.parse(data.data);
        })
            .catch(error => {
                console.log(error.error);
            });
    }

    checkToken() {
        this.storage.getItem('TOKEN').then(res => {
            if (res) {
                this.authenticationState.next(true);
            }
        });
    }

    getToken() {
        return this.storage.getItem('TOKEN');
    }

    isAuthenticated() {
        return this.authenticationState.value;
    }
}
