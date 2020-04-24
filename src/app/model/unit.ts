import { DeviceType } from './device_type';
import { BinType } from './bin_type';
import { ContentType } from './content_type';
import { User } from './user';

export class Unit {
    id: number;
    owner: User;
    serialNo: string;
    deviceType: DeviceType = new DeviceType();
    deviceTypeSort: string;
    location: string;
    latitude: number;
    longitude: number;
    binType: BinType = new BinType();
    binTypeSort: string;
    contentType: ContentType = new ContentType();
    contentTypeSort: string;
    useBinTypeLevel: boolean = true;
    emptyLevel: number = 0;
    fullLevel: number = 0;
    emptyLevelSort: number = 0;
    fullLevelSort: number = 0;

    reading40percent: number = 10;
    reading100percent: number = 10;

    lastActivity: Date;
    lastActivityStr: string = '';

    insertDate: Date;
    insertDateStr: string = '';
    insertBy: number = 0;
    modifiedDate: Date;
    modifiedDateStr: string = '';
    modifiedBy: number = 0;
  }