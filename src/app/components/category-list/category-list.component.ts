import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-category-list',
    templateUrl: './category-list.component.html',
    styleUrls: ['./category-list.component.scss'],
})
export class CategoryListComponent implements OnInit {
    private items = ['test', 'test2', 'test3', 'test4', 'test',
                    'test2', 'test3', 'test4', 'test', 'test2',
                    'test3', 'test4', 'test', 'test2', 'test3',
                    'test4'];

    constructor() {
    }

    ngOnInit() {
    }

}
