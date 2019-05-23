import {Component, OnInit} from '@angular/core';
import {CategoryService} from '../../service/category.service';
import {Category} from '../../_models/category';

@Component({
    selector: 'app-category-list',
    templateUrl: './category-list.component.html',
    styleUrls: ['./category-list.component.scss'],
})
export class CategoryListComponent implements OnInit {
    private items = ['test', 'test2', 'test3', 'test4', 'test',
        'test2', 'test3', 'test4', 'test', 'test2',
        'test3', 'test4', 'test', 'test2', 'test3',
        'test4'];
    public categories: Category[];

    constructor(private categoryService: CategoryService) {
    }

    async ngOnInit() {
        await this.categoryService.queryCategories().then((data: any) => {
            this.categories = data;
        }).catch((error) => {
            console.log(error);
        });
    }


}
