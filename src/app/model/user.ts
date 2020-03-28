import { Country } from './country';

export class User {
    id: number;
    email: string;
    password: string;
    role: number;
    parentId: number;
    status: number;

    locale: string;
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