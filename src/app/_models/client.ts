export class Client {
    id: number;
    name: string;
    email: string;
    discount: number;
    address: string;

    constructor(id: number = 0,
                name: string = '',
                email: string = '',
                discount: number = 0,
                address: string = '') {
        this.id = id;
        this.name = name;
        this.email = email;
        this.discount = discount;
        this.address = address;
    }


}
