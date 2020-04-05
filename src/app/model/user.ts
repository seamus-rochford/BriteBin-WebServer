import { Country } from './country';
import { Role } from './role';
import { Status } from './status';
import { Locale } from './locale';

export class User {
    id: number;
    email: string;
    password: string;
    role: Role;
    roleSort: string;
    parentId: number;
    status: Status;
    statusSort: string;

    locale: Locale;
    localeSort: string;
    name: string;
    addr1: string;
    addr2: string;
    city: string;
    county: string;
    postcode: string;
    country: Country;
    countrySort: string;
    
    mobile: string;
    homeTel: string;
    workTel: string;

    binLevelAlert: number;

    lastLoggedIn: Date;
    lastLoggedInStr: string;
    lastActivity: Date;
    lastActivityStr: string;

    insertDate: Date;
    insertDateStr: string;
    insertBy: number;
    modifiedDate: Date;
    modifiedBy: number;
  }