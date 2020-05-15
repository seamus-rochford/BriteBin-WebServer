import { User } from './user';

export class Alert {
    id: number = 0;
    user: User;

    binFull: boolean;

    // Flags
    batteryUVLO: boolean;
    binEmptiedLastPeriod: boolean;
    batteryOverTempLO: boolean;
    binLocked: boolean;
    // binFull: boolean;
    binTilted: boolean;
    serviceDoorOpen: boolean;
    flapStuckOpen: boolean;

    email: boolean;
    sms: boolean;
    whatsApp: boolean;
    pushNotification: boolean;

}