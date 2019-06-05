import {Component, OnInit, ViewChild} from '@angular/core';
import {OrderService} from '../service/order.service';
import {IonInfiniteScroll, ModalController} from '@ionic/angular';
import {Order} from '../_models/order';
import {OrderDetailModalPage} from './order-detail-modal/order-detail-modal.page';

@Component({
    selector: 'app-order-history',
    templateUrl: './order-history.page.html',
    styleUrls: ['./order-history.page.scss'],
})
export class OrderHistoryPage implements OnInit {
    @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
    orderCollection: any;

    constructor(private orderService: OrderService,
                private modalController: ModalController) {
    }

    async ngOnInit() {
        await this.orderService.getOrdersFromDB(0).then((data) => {
            this.orderCollection = data;
        }).catch((error) => {
            console.log('error in order fetching');
            console.log(error);
        });
    }

    public async getHistory(event: any) {
        const customerName = event.target.value;
        await this.orderService.getOrdersFromDB(0, customerName).then((data) => {
            this.orderCollection = data;
            console.log(data);
        }).catch((error) => {
            console.log('error in order fetching while client search');
            console.log(error);
        });
    }

    async loadData(event: any) {
        const lastId = this.orderCollection[this.orderCollection.length - 1].id;

        await this.orderService.getOrdersFromDB(lastId).then((data: Order[]) => {
            for (let i = 0; i < data.length; i++) {
                this.orderCollection.push(data[i]);
            }
        }).catch((error) => {
            console.log('error in order fetching');
            console.log(error);
        });

        event.target.complete();

    }

    public async showOrderDetail(id: number) {
        console.log('order id ==================');
        console.log(id);
        const modal = await this.modalController.create({
            component: OrderDetailModalPage,
            componentProps: {product: 'testing'}
        });
        return await modal.present();
    }

}
