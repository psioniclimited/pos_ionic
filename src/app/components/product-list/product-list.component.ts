import {Component, OnInit, ViewChild} from '@angular/core';
import {IonInfiniteScroll} from '@ionic/angular';
import {ProductService} from '../../service/product.service';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
    categoryId: string;

    @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
    productList = [
        {
            name: 'Smoky Grilled Chicken',
            description: 'smoky chicken, healthy & tasty'
        },
        {
            name: 'BBQ Pizza',
            description: 'Pizza that will change your taste bud'
        },
        {
            name: 'American Burger',
            description: 'will make you attack any country that have oil'
        },
        {
            name: 'American Burger',
            description: 'will make you attack any country that have oil'
        },
        {
            name: 'American Burger',
            description: 'will make you attack any country that have oil'
        },
        {
            name: 'American Burger',
            description: 'will make you attack any country that have oil'
        },
        {
            name: 'American Burger',
            description: 'will make you attack any country that have oil'
        },
        {
            name: 'American Burger',
            description: 'will make you attack any country that have oil'
        },
        {
            name: 'American Burger',
            description: 'will make you attack any country that have oil'
        },
        {
            name: 'American Burger',
            description: 'will make you attack any country that have oil'
        },
        {
            name: 'American Burger',
            description: 'will make you attack any country that have oil'
        },
        {
            name: 'American Burger',
            description: 'will make you attack any country that have oil'
        },
        {
            name: 'American Burger',
            description: 'will make you attack any country that have oil'
        }

    ];

    constructor(private productService: ProductService) {
    }

    async ngOnInit() {
        this.categoryId = 'all';
        this.productService.selectedCategory.subscribe(async (data) => {
            this.categoryId = data;
            console.log('Product List Component');
            console.log(this.categoryId);
            await this.productService.getProducts(this.categoryId).then((res) => {
                console.log(res);
            }).catch((error) => {
                console.log(error);
            });
        });

    }

    loadData(event) {
        setTimeout(() => {
            console.log('Done');
            event.target.complete();

            // App logic to determine if all data is loaded
            // and disable the infinite scroll
            // if (data.length === 1000) {
            //     event.target.disabled = true;
            // }
        }, 500);
    }

    toggleInfiniteScroll() {
        this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
    }
}
