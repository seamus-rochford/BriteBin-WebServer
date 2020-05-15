import { Unit } from './unit';

export class Reading {
    id: number;
    unit: Unit;
    locationSort: string;
    binTypeSort: string;
    contentTypeSort: string;
    deviceTypeSort: string;
    rawDataId: number;
    msgType: number;

    binLevel: number;
    binLevelPercent: number;
    binLevelBC: number;
    binLevelBCPercent: number;
    compactionDone: boolean;
    noFlapOpenings: number;
    batteryVoltageReading: number;
    batteryVoltage: number;
    temperature: number;
    noCompactions: number;
    
    // Flags
    batteryUVLO: boolean;
    binEmptiedLastPeriod: boolean;
    batteryOverTempLO: boolean;
    binLocked: boolean;
    binFull: boolean;
    binTilted: boolean;
    serviceDoorOpen: boolean;
    flapStuckOpen: boolean;

    nbiotSignalStrength: number;

    // tekelek sensor system values
    rssi: number;
    src: number;

    // Pel bin sensor system values
    snr: number;
    ber: number;
    rsrq: number;
    rsrp: number;

    readingDateTime: Date;
    readingDateTimeStr: string = '';    

    binLevelStatus: number;  // 1 = Empty, 2 = In between, 3 = full

    source: String;
}