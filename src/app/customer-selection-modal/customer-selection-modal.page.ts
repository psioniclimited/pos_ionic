import {Component, OnInit} from '@angular/core';
import {ClientService} from '../service/client.service';
import {Router} from '@angular/router';
import * as _ from 'lodash';

@Component({
    selector: 'app-customer-selection-modal',
    templateUrl: './customer-selection-modal.page.html',
    styleUrls: ['./customer-selection-modal.page.scss'],
})
export class CustomerSelectionModalPage implements OnInit {
    clients: any;
    selectedOption: any;

    constructor(private clientService: ClientService, private router: Router) {
    }

    async ngOnInit() {
        const client = this.clientService.getClient();
        client ? this.selectedOption = client.id : this.selectedOption = null;
        await this.initializeClientCollection();
    }

    async ionViewWillEnter() {
    }

    private async initializeClientCollection() {
        await this.clientService.getClients(0).then((data) => {
            !this.selectedOption ? this.selectedOption = data[0].id : '';
            this.clients = data;
        }).catch((error) => {
            console.log(error);
        });
    }

    async doInfinite(infiniteScroll) {
        const lastId = this.clients[this.clients.length - 1].id;

        await this.clientService.getClients(lastId).then((res: any) => {
            for (let i = 0; i < res.length; i++) {
                this.clients.push(res[i]);
            }
        }, (error) => {
            // console.log(error);
        });

        infiniteScroll.complete();
    }

    confirmClient() {
        const client = _.find(this.clients, (client) => {
            return client.id == this.selectedOption;
        });
        this.clientService.setClient(client);
        this.router.navigate(['cart']);
    }

    dismiss() {
        this.router.navigate(['cart']);
    }

}
