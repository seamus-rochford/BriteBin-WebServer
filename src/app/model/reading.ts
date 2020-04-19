import { Unit } from './unit';

export class Reading {
    id: number;
    unit: Unit;
    locationSort: string;
    binTypeSort: string;
    contentTypeSort: string;
    rawDataId: number;
    msgType: number;

    binLevel: number;
    binLevelPercent: number;
    binLevelBC: number;
    binLevelBCPercent: number;
    noFlapOpenings: number;
    batteryVoltage: number;
    temperature: number;
    noCompactions: number;
    
    // Flags
    batteryUVLO: boolean;
    binEmpiedLastPeriod: boolean;
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

    binLevelType: number;  // 0 = Empty, 1 = In between, 2 = full
}