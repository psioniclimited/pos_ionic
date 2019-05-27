import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {AuthService} from '../service/auth.service';
import {Creds} from '../_models/Creds';
import {Router} from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    loginForm: FormGroup;
    token = '';

    constructor(private authenticationService: AuthService,
                private storage: NativeStorage,
                private router: Router) {
    }

    ngOnInit() {
        this.formInit();
        this.authenticationService.checkToken().then(() => {
        }).catch((error) => {
            console.log(error);
        });
        // this.authenticationService.authenticationState.subscribe(state => {
        //     if (state) {
        //         this.router.navigate(['menu']);
        //     }
        // });
    }

    private formInit() {
        this.loginForm = new FormGroup({
            email: new FormControl('riger400@gmail.com', Validators.required),
            password: new FormControl('qwerasdf', Validators.required)
        });
    }

    async onSubmit() {
        if (this.loginForm.valid) {
            const creds = new Creds(
                this.loginForm.value.email,
                this.loginForm.value.password
            );
            await this.authenticationService.login(creds).then(data => {
                console.log(data);
            });
            this.authenticationService.authenticationState.subscribe(state => {
                if (state) {
                    this.router.navigate(['menu']);
                }
            });
        }
    }

    showToken() {
        this.storage.getItem('TOKEN').then((val) => {
            console.log(val);
            this.token = val;
        });
    }

}
