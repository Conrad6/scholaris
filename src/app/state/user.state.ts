import { State } from "@ngxs/store";
import { Injectable, inject } from "@angular/core";
import { UserService } from "./services/user.service";
import { UserStateModel } from "../../models";

@State<UserStateModel>({
    name: 'user'
})
@Injectable()
export class UserState {
    private readonly userService = inject(UserService);
    constructor() {
        
    }
}