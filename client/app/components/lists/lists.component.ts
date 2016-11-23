import { Component } from '@angular/core';
import { ListService } from '../../services/list.service';
import { List } from '../../models/list.model';
import { Ingredient } from '../../models/ingredient.model';

const INGREDIENTS: Ingredient[] = [
    { ingredientName: "pickles" },
    { ingredientName: "peter" },
    { ingredientName: "piper" },
    { ingredientName: "picked" },
    { ingredientName: "peppers" },
    { ingredientName: "paprika" },
    { ingredientName: "majoram" },
    { ingredientName: "dill" },
    { ingredientName: "snack wells" }
];

@Component({
  moduleId: module.id,
  selector: 'lists',
  templateUrl: 'lists.component.html',
  providers: [ ListService ]
})

export class ListsComponent {
  lists: List[];
  listName: string;
  ingredients: Ingredient[];


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
    // var ingredientsJSON = [];
    //
    // for (var ingredientIndex = 0; ingredientIndex < ingredients.length; ingredientIndex++) {
    //     currentIngredient = {
    //         ingredientName:
    //     }
    //     ingredientsJSON.push()
    // }

    var newList = {
      listName: this.listName,
      ingredients: INGREDIENTS
    };

    this.listService.addList(newList)
      .subscribe(list => {
        this.lists.push(list);
        this.listName = '';
        this.ingredients = INGREDIENTS;
    });
  }
}
