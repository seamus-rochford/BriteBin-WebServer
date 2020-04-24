import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })

export class Global {

    public binStatus = {
        BIN_EMPTY: 1,
        BIN_BETWEEN: 2,
        BIN_FULL: 3
    }

    public binColor = {
        EMPTY: '#2b8f17',
        IN_BETWEEN: '#fc8804',
        FULL: '#da291c'
    }

    public userStatus = {
        INACTIVE: -1,
        REGISTERED: 0,
        ACTIVE: 1
    }

    public userRoles = {
        ADMIN: 0,
        MUNICIPAL: 1,
        SUB_MUNICIPAL: 2,
        CUSTOMER: 3,
        DRIVER: 4
    }

}