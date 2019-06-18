export class Addon {
    name: string;
    price: number;
    id: number;
    productId: number;

    constructor(name: string = '', price: number) {
        this.name = name;
        this.price = price;
    }
}
