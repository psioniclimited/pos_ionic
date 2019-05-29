import {Component, OnInit} from '@angular/core';
import {OrderService} from '../service/order.service';
import {Order} from '../_models/order';
import {Router} from '@angular/router';
import {ClientService} from '../service/client.service';
import {Client} from '../_models/client';
import {ModalController} from '@ionic/angular';
import {DiscountModalPage} from '../discount-modal/discount-modal.page';
import {BluetoothSerial} from '@ionic-native/bluetooth-serial/ngx';
import {BluetoothPrinterService} from '../bluetooth-printer.service';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.page.html',
    styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
    order: Order;
    total: number;
    discount: number;
    grandTotal: number;
    client: Client;
    orderSubmit = false;

    constructor(private orderService: OrderService,
                private clientService: ClientService,
                public modalController: ModalController,
                private bluetoothSerial: BluetoothSerial,
                private bluetoothPrinterService: BluetoothPrinterService,
                private router: Router) {
    }

    ngOnInit() {
        // this.order = new Order();
        this.order = this.orderService.getOrder();
        this.orderService.total.subscribe((total) => {
            this.total = total;
        });
        this.orderService.discount.subscribe((discount) => {
            this.discount = discount;
        });
        this.orderService.grandTotal.subscribe((grandTotal) => {
            this.grandTotal = grandTotal;
        });
    }

    ionViewWillEnter() {
        this.orderSubmit = false;
    }

    calculateItemTotal(orderDetail) {
        if (orderDetail.option) {
            return orderDetail.option.price * orderDetail.quantity;
        }
        return orderDetail.product.salePrice * orderDetail.quantity;
    }

    getDescription(orderDetail) {
        let description = orderDetail.product.name;
        if (orderDetail.option) {
            description += ' ' + orderDetail.option.type;
        }
        return description;
    }

    increaseQuantity(orderDetailIndex) {
        // console.log(orderDetailIndex);
        this.orderService.increaseQuantity(orderDetailIndex);
    }

    decreaseQuantity(orderDetailIndex) {
        this.orderService.decreaseQuantity(orderDetailIndex);
    }

    removeOrderDetail(orderDetailIndex) {
        this.orderService.removeOrderDetail(orderDetailIndex);
    }

    cancelOrder() {
        this.clientService.setClient(null);
        this.orderService.setOrder(null);
        this.router.navigate(['menu']);
    }

    selectCustomer() {
        this.router.navigate(['customer-selection-modal']);
    }

    public async openDiscountModal() {
        const modal = await this.modalController.create({
            component: DiscountModalPage,
            componentProps: {discount: this.discount},
            cssClass: 'my-custom-modal-css'
        });
        return await modal.present();
    }

    getClient() {
        const client = this.clientService.getClient();
        if (client) {
            return client.name;
        }
        return '';
    }

    async confirmOrder() {
        const order = this.orderService.getOrder();
        if (order.client.id == 0) {
            this.selectCustomer();
        }
        await this.orderService.createOrder().then(() => {
            this.orderSubmit = true;
        }).catch((error) => {
            console.log(error);
        });
    }

    async printToken() {
        this.bluetoothSerial.isConnected().then((data) => {
                // const format = new Uint8Array(3);
                // format[0] = 0x1B;
                // format[1] = 0x21;
                // format[2] = 0x00;
                // this.bluetoothSerial.write(format).then();
                this.bluetoothSerial.write('\x1B\x21\x30HelloWord \n\n\n\n').then();
            }
        );
        // await this.bluetoothPrinter.connectPrinter().then();
        // const data = new Uint8Array(3);
        // data[0] = 0x1B;
        // data[1] = 0x21;
        // data[2] = 0x00;
        // this.bluetoothSerial.write(data).then();
        // setTimeout(() =>  {
        //     this.bluetoothSerial.write('TOKEN NUMBER 1').then();
        // }, 3000);


    }

    printReceipt() {
        console.log('print receipt');
    }

    orderDone() {
        console.log('order done');
    }
}
