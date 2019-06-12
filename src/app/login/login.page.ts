import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {AuthService} from '../service/auth.service';
import {Creds} from '../_models/Creds';
import {Router} from '@angular/router';
import {AlertController, LoadingController, NavController} from '@ionic/angular';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
    private onDestroy$: Subject<void> = new Subject<void>();
    loginForm: FormGroup;
    token = '';

    constructor(private authenticationService: AuthService,
                private storage: NativeStorage,
                private router: Router,
                private navCtrl: NavController,
                private loadingController: LoadingController,
                private alertController: AlertController) {
    }

    ngOnInit() {
        this.formInit();
        this.authenticationService.checkToken().then(() => {
        }).catch((error) => {
            console.log(error);
        });
        // this.authenticationService.authenticationState.subscribe(state => {
        //     if (state) {
        //         this.navCtrl.navigateRoot('menu');
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
        const loading = await this.loadingController.create({
            message: 'Logging....',
        });
        if (this.loginForm.valid) {
            const creds = new Creds(
                this.loginForm.value.email,
                this.loginForm.value.password
            );
            await loading.present();
            await this.authenticationService.login(creds).then(async (data) => {
                console.log(data);
                await loading.dismiss();
                if (data === -1) {
                    const alert = await this.alertController.create({
                        header: 'Login Error',
                        message: 'Sorry server is down, please try again later.',
                        buttons: ['OK']
                    });
                    await alert.present();
                } else if (data === 401) {
                    const alert = await this.alertController.create({
                        header: 'Login Error',
                        message: 'Invalid Credentials.',
                        buttons: ['OK']
                    });
                    await alert.present();
                } else {
                    // this.navCtrl.navigateRoot(['menu']);
                    console.log(this.authenticationService.getToken());
                    this.router.navigateByUrl('menu');
                }
            });
            // this.authenticationService.authenticationState.pipe(takeUntil(this.onDestroy$))
            //     .subscribe(async (state) => {
            //     if (state) {
            //         await loading.dismiss();
            //         this.navCtrl.navigateRoot(['menu']);
            //     } else {
            //         await loading.dismiss();
            //         console.log('server close testing =====');
            //         console.log(state);
            //         const alert = await this.alertController.create({
            //             header: 'Login Error',
            //             message: 'Sorry Could not login, please try again later.',
            //             buttons: ['OK']
            //         });
            //         await alert.present();
            //     }
            // });
        }
    }

    showToken() {
        this.storage.getItem('TOKEN').then((val) => {
            console.log(val);
            this.token = val;
        });
    }

    public ngOnDestroy(): void {
        this.onDestroy$.next();
    }

}
