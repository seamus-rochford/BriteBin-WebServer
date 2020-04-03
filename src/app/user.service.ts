import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './model/user';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private readonly userUrl = `${environment.apiUrl}/user`;

  constructor(private httpClient: HttpClient) { }

  // GET users
  getUsers() {
    const url = `${this.userUrl}/getUsers`;
    console.log('GetUsers Url: ' + url);

    return this.httpClient.get(url);
  }

  // GET user (by userId)
  getUser(userId: number) {
    const url = `${this.userUrl}/getUser?useId=` + userId;
    console.log('GetUser Url: ' + url);
    return this.httpClient.get(url);
  }

  // GET user (by email)
  getUserByEmail(email: string) {
    const url = `${this.userUrl}/getUser?email=` + email;
    console.log('GetUser Url: ' + url);
    return this.httpClient.get(url);
  }

  // POST de-activate user (by email)
  deactivate(email: string) {

    const url = this.userUrl + '/deactivateUser?email=' + email;
    console.log('Deactivate Url: ' + url);

    return this.httpClient.post(url, null).toPromise();
  }

  // POST de-activate user (by id)
  deactivateById(userId: number) {

    const url = this.userUrl + '/deactivateUser?userId=' + userId;
    console.log('Deactivate Url: ' + url);

    return this.httpClient.post(url, null).toPromise();
  }

  // POST activate user (by email)
  Activate(email: string) {

    const url = this.userUrl + '/activateUser?email=' + email;
    console.log('Deactivate Url: ' + url);

    return this.httpClient.post(url, null).toPromise();
  }

  // POST activate user (by id)
  ActivateById(userId: number) {

    const url = this.userUrl + '/activateUser?userId=' + userId;
    console.log('Deactivate Url: ' + url);

    return this.httpClient.post(url, null).toPromise();
  }

  // POST save user
  add(user: User) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    const url = this.userUrl + '/save';
    console.log('Save Url: ' + url);

    return this.httpClient.post(url, user, httpOptions).toPromise();
  }
}
