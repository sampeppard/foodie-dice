import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable() export class LoginService {
  constructor(private http:Http) {
    console.log('Login Service Initialized...');
  }
}
