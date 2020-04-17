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
    binLevelBC: number;
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
    rssi: number;
    src: number;
    snr: number;
    ber: number;
    rsrq: number;
    rsrp: number;

    readingDateTime: Date;
    readingDateTimeStr: string = '';    

    binLevelType: number;  // 0 = Empty, 1 = In between, 2 = full
}