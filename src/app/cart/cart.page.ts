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
import * as _ from 'lodash';

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
    tokenNumber: any;

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
    }

    ionViewWillEnter() {
        this.orderSubmit = false;
        this.order = this.orderService.getOrder();
        console.log('getting order ======');
        console.log(this.order);
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

    ionViewDidEnter() {
        document.addEventListener('backbutton', (e) => {
            console.log('disable back button');
        }, false);
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
        if (!this.orderSubmit) {
            const modal = await this.modalController.create({
                component: DiscountModalPage,
                componentProps: {discount: this.discount},
                cssClass: 'my-custom-modal-css'
            });
            return await modal.present();
        }

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
        if (order.client.id === 0) {
            this.selectCustomer();
        } else {
            await this.orderService.createOrder().then((orderId) => {
                this.orderSubmit = true;
                this.bluetoothSerial.isConnected().then((data) => {
                    this.tokenNumber = orderId;
                    this.bluetoothSerial.write('\x1B\x21\x30   OVEN FRESH\nTOKEN NUMBER: ' + orderId +
                        '\x1B\x21\x00\nH#6, R#2, S#3, Uttara, Dhaka \n' +
                        'Phone: 01787765676\n\n\n').then();
                    // this.bluetoothSerial.write('TOKEN NUMBER: ' + orderId + ' \n').then();
                });
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    async printToken() {
        this.bluetoothSerial.isConnected().then((data) => {
                const format = new Uint8Array(3);
                format[0] = 0x1B;
                format[1] = 0x21;
                format[2] = 0x00;
                this.bluetoothSerial.write(format).then();
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

    async printReceipt() {
        // console.log(this.order.client);
        this.bluetoothSerial.isConnected().then((data) => {
                // print header
                let printData = '\x1B\x21\x30   OVEN FRESH \nTOKEN NUMBER: ' + this.tokenNumber + '\n';
                printData += '\x1B\x21\x00';
                printData += 'H#6, R#2, S#3, Uttara, Dhaka' + '\n';
                printData += 'Phone: 01787765676' + '\n';
                printData += 'Name: ' + this.order.client.name + '\n';
                printData += 'Date: ' + this.order.date + '\n';
                printData += '\x1B\x21\x08';
                // printData += 'Date: ' + moment
                printData += 'Item';
                for (let i = 4; i < 22; i++) {
                    printData += ' ';
                }
                printData += 'Qty  ';
                printData += 'Price\n';
                printData += '\x1B\x21\x00';
                // print order;
                _.forEach(this.order.orderDetails, (value) => {
                    printData += value.product.name + ' ';
                    const productNameLength = value.product.name.length;
                    if (value.option) {
                        printData += value.option.type;
                    }
                    for (let i = productNameLength; i < 18; i++) {
                        printData += ' ';
                    }
                    // make space dynamic
                    printData += value.quantity;
                    for (let i = value.quantity.toString().length; i < 5; i++) {
                        printData += ' ';
                    }
                    if (value.option) {
                        printData += value.option.price * value.quantity + '\n';
                    } else {
                        printData += value.product.salePrice * value.quantity + '\n';
                    }
                });
                for (let i = 0; i < 32; i++) {
                    printData += '-';
                }
                printData += '\n';
                // print footer
                const subTotalText = 'Subtotal: ' + this.order.total;
                for (let i = subTotalText.length; i < 30; i++) {
                    printData += ' ';
                }
                printData += subTotalText + '\n';
                const discountText = 'Discount: ' + this.order.discount + '%';
                for (let i = discountText.length; i < 30; i++) {
                    printData += ' ';
                }
                printData += discountText + '\n';
                const total = this.order.total - (this.order.total * this.order.discount) / 100;
                const totalText = 'Total: ' + total;
                for (let i = totalText.length; i < 30; i++) {
                    printData += ' ';
                }
                printData += totalText + '\n\n\n';
                this.bluetoothSerial.write(printData).then();
            }
        );
    }

    async orderDone() {
        this.clientService.setClient(null);
        this.orderService.setOrder(null);
        this.router.navigate(['menu']);
    }
}
