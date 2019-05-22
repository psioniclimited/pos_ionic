import {Component, OnInit} from '@angular/core';
import {CategoryService} from '../service/category.service';

@Component({
    selector: 'app-pos',
    templateUrl: './pos.page.html',
    styleUrls: ['./pos.page.scss'],
})
export class PosPage implements OnInit {

    constructor(private categoryService: CategoryService) {
    }

    ngOnInit() {
    }

    public async updateMenu() {
        await this.categoryService.index().then().catch((error) => {
            console.log(error);
        });
    }

}
