import {Component, OnInit} from '@angular/core';

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

    constructor() {
    }

    ngOnInit() {
    }

}
