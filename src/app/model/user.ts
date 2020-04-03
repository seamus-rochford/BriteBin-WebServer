import { Country } from './country';
import { Role } from './role';
import { Status } from './status';
import { Locale } from './locale';

export class User {
    id: number;
    email: string;
    password: string;
    role: Role;
    parentId: number;
    status: Status;

    locale: Locale;
    name: string;
    addr1: string;
    addr2: string;
    city: string;
    county: string;
    postcode: string;
    country: Country;
    
    mobile: string;
    homeTel: string;
    workTel: string;

    binLevelAlert: number;

    lastLoggedIn: Date;
    lastActivity: Date;

    insertDate: Date;
    insertBy: number;
    modifiedDate: Date;
    modifiedBy: number;
  }