import { ContentType } from './content_type';
import { BinType } from './bin_type';
import { DeviceType } from './device_type';
import { User } from './user';
import { BinLevel } from './bin_level';

export class ReadingsSearch {
    searchStr: string[];

    contentTypes: ContentType[];
    binTypes: BinType[];
    binLevels: BinLevel[];
    deviceTypes: DeviceType[];
    owners: User[];
}