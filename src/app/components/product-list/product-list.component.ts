import {Component, OnInit, ViewChild} from '@angular/core';
import {IonInfiniteScroll, ModalController} from '@ionic/angular';
import {ProductService} from '../../service/product.service';
import {ProductSelectionModalPage} from '../../product-selection-modal/product-selection-modal.page';
import {Product} from '../../_models/product';
import {OrderService} from '../../service/order.service';
import {UpdateService} from '../../service/update.service';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
    categoryId: string;
    total: number;
    @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
    productList: any;

    constructor(private productService: ProductService,
                private modalController: ModalController,
                private orderService: OrderService,
                private updateService: UpdateService) {
    }

    async ngOnInit() {
        this.productList = [];
        this.categoryId = '0';
        this.productService.selectedCategory.subscribe(async (data) => {
            this.categoryId = data;
            await this.productService.getProducts(this.categoryId).then((res) => {
                this.productList = res;
            }).catch((error) => {
                console.log(error);
            });
        });
        this.orderService.total.subscribe((total) => {
            this.total = total;
        });

        this.updateService.isUpdated.subscribe(async (updateResponse) => {
            await this.productService.getProducts(this.categoryId).then((res) => {
                this.productList = res;
            }).catch((error) => {
                console.log(error);
            });
        });
    }

    public async selectProduct(product: Product) {
        const modal = await this.modalController.create({
            component: ProductSelectionModalPage,
            componentProps: {product: product}
        });
        return await modal.present();
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
