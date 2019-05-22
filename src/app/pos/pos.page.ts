import {Component, OnInit} from '@angular/core';
import {UpdateService} from '../service/update.service';

@Component({
    selector: 'app-pos',
    templateUrl: './pos.page.html',
    styleUrls: ['./pos.page.scss'],
})
export class PosPage implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }

    public async updateMenu() {
        // await this.updateService.index().then().catch((error) => {
        //     console.log(error);
        // });
    }

}
