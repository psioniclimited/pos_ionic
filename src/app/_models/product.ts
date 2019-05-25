import {Addon} from './addon';
import {Option} from './option';

export class Product {
    id: string;
    categoryId: string;
    name: string;
    cost: number;
    salePrice: number;
    description: string;
    hasAddons: number;
    hasOptions: number;
    options: Option[];

    constructor(
        id: string = '',
        categoryId: string = '',
        name: string = '',
        cost: number = 0,
        salePrice: number = 0,
        description: string = '',
        hasAddons: number = 0,
        hasOptions: number = 0,
    ) {
        this.id = id;
        this.categoryId = categoryId;
        this.name = name;
        this.cost = cost;
        this.salePrice = salePrice;
        this.description = description;
        this.hasAddons = hasAddons;
        this.hasOptions = hasOptions;
    }
}
