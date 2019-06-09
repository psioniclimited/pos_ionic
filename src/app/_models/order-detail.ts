import {Option} from './option';
import {Product} from './product';

export class OrderDetail {
    option: Option;
    product: Product;
    total: number;
    quantity: number;
    productId: number;
    optionId: number;


    constructor(option: Option = null, product: Product = null, total: number = 0, quantity: number = 0) {
        this.option = option;
        this.product = product;
        this.total = total;
        this.quantity = quantity;
    }
}
