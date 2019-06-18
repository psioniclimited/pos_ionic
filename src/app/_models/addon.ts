export class Addon {
    name: string;
    price: number;
    id: number;
    productId: number;
    isChecked: boolean;

    constructor(name: string = '', price: number) {
        this.name = name;
        this.price = price;
        this.isChecked = false;
    }
}
