import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable() export class ListService {
  constructor(private http:Http) {
    console.log('List Service Initialized...');
  }

  getLists() {
    return this.http.get('http://localhost:8000/api/lists')
      .map(res => res.json());
  }
}
