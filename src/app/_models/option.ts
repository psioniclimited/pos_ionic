export class Option {
    id: string;
    productId: string;
    type: string;
    price: number;


    constructor(id: string = '',
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
