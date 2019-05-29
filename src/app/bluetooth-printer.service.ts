import {Injectable} from '@angular/core';
import {BluetoothSerial} from '@ionic-native/bluetooth-serial/ngx';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BluetoothPrinterService {
    devices: any[];
    printerStatus = new BehaviorSubject(false);

    constructor(private bluetoothSerial: BluetoothSerial) {
    }

    async connectPrinter() {
        this.bluetoothSerial.enable().then(async (data) => {
            await this.listPairDevices();
        }, error => {
            console.log(error);
        });
    }

    listPairDevices() {
        this.bluetoothSerial.list().then(async (devices) => {
            this.devices = devices;
            await this.connect();
        }, error => {
            console.log(error);
        });
    }

    async connect() {
        const connectedDevice = this.devices[0];
        this.bluetoothSerial.connect(connectedDevice.address).subscribe(async () => {
            await this.deviceConnected();
            console.log('printer connected');
            this.printerStatus.next(true);
        }, error => {
            console.log(error);
        });
    }

    async deviceConnected() {
        this.bluetoothSerial.subscribe('\n').subscribe(success => {
            // emit an event
        }, error => {
            console.log(error);
        });
    }

}
