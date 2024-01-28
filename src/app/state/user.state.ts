import { Injectable, inject } from "@angular/core";
import { Action, State, StateContext } from "@ngxs/store";
import { from, tap } from "rxjs";
import { AuthRequest, NewUserRequest, UserStateModel } from "../../models";
import { SignIn, SignOut, SignUp } from "./actions/user.actions";
import { UserService } from "./services/user.service";

@State<UserStateModel>({
    name: 'user'
})
@Injectable()
export class UserState {
    private readonly userService = inject(UserService);

    @Action(SignOut)
    onSignOut(ctx: StateContext<UserStateModel>) {
        return from(this.userService.signOut()).pipe(
            tap(() => ctx.setState({}))
        );
    }

    @Action(SignIn, { cancelUncompleted: true })
    onSignIn(ctx: StateContext<UserStateModel>, action: SignIn) {
        return this.userService.signIn(action as unknown as AuthRequest).pipe(
            tap(([user, session, [logo]]) => ctx.patchState({ principal: user, session, logo }))
        );
    }

    @Action(SignUp, { cancelUncompleted: true })
    onSignUp(_: StateContext<UserStateModel>, action: SignUp) {
        return this.userService.signUp(action as unknown as NewUserRequest);
    }
}