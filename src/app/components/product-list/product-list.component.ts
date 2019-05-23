import {Component, OnInit, ViewChild} from '@angular/core';
import {IonInfiniteScroll} from '@ionic/angular';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {

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

    constructor() {
    }

    ngOnInit() {
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
