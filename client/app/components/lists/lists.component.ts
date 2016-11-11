import { Component } from '@angular/core';
import { ListService } from '../../services/list.service';
import { List } from '../../../list.model';

@Component({
  moduleId: module.id,
  selector: 'lists',
  templateUrl: 'lists.component.html'
})

export class ListsComponent {
  lists: List[];
  listName: string;
  ingredients: ["pickles", "peter", "piper", "picked", "peppers", "paprika", "majoram", "dill", "snack wells"];

  constructor(private listService: ListService) {
    this.listService.getLists()
      .subscribe(lists => {
        this.lists = lists;
      // console.log(this.lists[0].ingredients);
      });
    //NOTE: async issue!
    // console.log(this.lists[0].ingredients);
  }

  addList(event) {
    event.preventDefault();
    var newList = {
      listName: this.listName,
      ingredients: ["pickles", "peter", "piper", "picked", "peppers", "paprika", "majoram", "dill", "snack wells"]
    }

    this.listService.addList(newList)
      .subscribe(list => {
        this.lists.push(list);
        this.listName = '';
        this.ingredients = ["pickles", "peter", "piper", "picked", "peppers", "paprika", "majoram", "dill", "snack wells"];
      })
  }
}
