import {Component, OnInit} from '@angular/core';
import {UpdateService} from '../service/update.service';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.page.html',
    styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

    pages = [
        {
            title: 'Pos',
            url: '/menu/pos',
            icon: 'home'
        }
    ];

    constructor(private updateService: UpdateService) {
    }

    ngOnInit() {
    }

    update() {
        console.log('update click');
        this.updateService.index().then().catch((error) => {
            console.log('updating error');
            console.log(error);
        });

    }

}
