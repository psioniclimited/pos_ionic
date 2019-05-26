export class Option {
    id: number;
    productId: string;
    type: string;
    price: number;


    constructor(id: number = 0,
                productId: string = '',
                type: string = '',
                price: number = 0,
    ) {
        this.id = id;
        this.productId = productId;
        this.type = type;
        this.price = price;
    }
}
