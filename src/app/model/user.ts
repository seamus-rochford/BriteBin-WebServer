import { Country } from './country';
import { Role } from './role';
import { Status } from './status';
import { Locale } from './locale';

export class User {
    id: number;
    email: string;
    password: string;
    newPassword: string;
    confirmPassword: string;
    role: Role = new Role();
    roleSort: string;
    parent: User;
    parentSort: string;
    status: Status = new Status();
    statusSort: string;

    locale: Locale = new Locale();
    localeSort: string;
    name: string = '';
    addr1: string = '';
    addr2: string = '';
    city: string = '';
    county: string = '';
    postcode: string = '';
    country: Country = new Country();
    countrySort: string;
    
    mobile: string = '';
    homeTel: string = '';
    workTel: string = '';

    binLevelAlert: number = 0;

    lastLoggedIn: Date;
    lastLoggedInStr: string = '';
    lastActivity: Date;
    lastActivityStr: string = '';

    insertDate: Date;
    insertDateStr: string = '';
    insertBy: number = 0;
    modifiedDate: Date;
    modifiedDateStr: string = '';
    modifiedBy: number = 0;

    selected: boolean = true;  // only used in mapSearch

  }