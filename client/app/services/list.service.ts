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

  //TODO: figure out if JSON.stringify would work if we passed in a List object
  addList(newList) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:8000/api/lists', JSON.stringify(newList), {headers: headers})
      .map(res => res.json());
  }
}
