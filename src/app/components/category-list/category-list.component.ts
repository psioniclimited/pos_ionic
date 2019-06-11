import {Component, OnInit} from '@angular/core';
import {CategoryService} from '../../service/category.service';
import {Category} from '../../_models/category';
import {ProductService} from '../../service/product.service';
import {UpdateService} from '../../service/update.service';

@Component({
    selector: 'app-category-list',
    templateUrl: './category-list.component.html',
    styleUrls: ['./category-list.component.scss'],
})
export class CategoryListComponent implements OnInit {
    public categories: Category[];

    constructor(private categoryService: CategoryService,
                private productService: ProductService,
                private updateService: UpdateService) {
    }

    async ngOnInit() {
        this.updateService.isUpdated.subscribe(async (res) => {
            await this.categoryService.queryCategories().then((data: any) => {
                this.categories = data;
            }).catch((error) => {
                console.log(error);
            });
        });

    }

    selectCategory(data) {
        console.log('selected data');
        console.log(data);
        this.productService.setCategory(data);
    }


}
