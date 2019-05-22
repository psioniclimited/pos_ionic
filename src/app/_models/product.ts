export class Product {
    id: string;
    name: string;
    cost: number;
    salePrice: number;
    description: string;
    hasAddons: number;
    hasOptions: number;
    constructor(obj?: any) {
        this.id = obj && obj.id || 0;
        this.name = obj && obj.name || '';
        this.cost = obj && obj.cost || null;
        this.salePrice = obj && obj.sale_price || null;
        this.description = obj && obj.description || null;
        this.hasAddons = obj && obj.hasAddons || null;
        this.hasOptions = obj && obj.hasOptions || null;
    }
}
