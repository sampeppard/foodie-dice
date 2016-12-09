import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from '../../services/login.service';

@Component({
    moduleId: module.id,
    selector: 'login',
    templateUrl: './login.component.html',
    providers: [ LoginService ]
})

export class LoginComponent {
    constructor(private loginService: LoginService, private router: Router) {
        console.log("injecting login service and router");
    }

    onLogin(username: String, password: String) {
        console.log("calling login function in loginService");
        // this.router.navigate(['lists']);
    }
}
