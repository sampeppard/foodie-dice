"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var list_service_1 = require("../../services/list.service");
var ListsComponent = (function () {
    function ListsComponent(listService) {
        var _this = this;
        this.listService = listService;
        this.listService.getLists()
            .subscribe(function (lists) {
            _this.lists = lists;
            // console.log(this.lists[0].ingredients);
        });
        //NOTE: async issue!
        // console.log(this.lists[0].ingredients);
    }
    return ListsComponent;
}());
ListsComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'lists',
        templateUrl: 'lists.component.html'
    }),
    __metadata("design:paramtypes", [list_service_1.ListService])
], ListsComponent);
exports.ListsComponent = ListsComponent;
//# sourceMappingURL=lists.component.js.map