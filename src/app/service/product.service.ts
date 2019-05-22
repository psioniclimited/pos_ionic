import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    constructor() {
    }

    public index() {
        // fetch from sql
    }

    public getProducts() {
        const sql = 'SELECT * FROM products WHERE id > ? LIMIT 30';
    }
}
