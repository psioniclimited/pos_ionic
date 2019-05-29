import { TestBed } from '@angular/core/testing';

import { BluetoothPrinterService } from './bluetooth-printer.service';

describe('BluetoothPrinterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BluetoothPrinterService = TestBed.get(BluetoothPrinterService);
    expect(service).toBeTruthy();
  });
});
