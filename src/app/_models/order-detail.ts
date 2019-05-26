import {Option} from './option';
import {Product} from './product';

export class OrderDetail {
    option: Option;
    product: Product;
    total: number;
    quantity: number;


    constructor(option: Option, product: Product, total: number, quantity: number) {
        this.option = option;
        this.product = product;
        this.total = total;
        this.quantity = quantity;
    }
}
