import { Injectable, inject } from "@angular/core";
import { Account, Avatars, Client, ID } from "appwrite";
import { forkJoin, from, mergeMap, of, switchMap } from "rxjs";
import { AuthRequest, NewUserRequest, UserPreferences } from "../../../models";

@Injectable({ providedIn: 'root' })
export class UserService {
    private account = new Account(inject(Client));
    private avatars = new Avatars(inject(Client));

    async signOut() {
        await this.account.deleteSession('current');
    }

    signIn({ email, password }: AuthRequest) {
        return from(this.account.createEmailSession(email, password)).pipe(
            mergeMap((session) => forkJoin([
                this.account.get<UserPreferences>(),
                of(session),
                from(this.account.getPrefs<UserPreferences>()).pipe(
                    switchMap(prefs => {
                        return forkJoin([
                            of(prefs.logo ?? this.avatars.getInitials().toString()),
                            of(prefs),
                        ])
                    })
                )
            ]))
        );
    }

    signUp({ email, names, password }: NewUserRequest) {
        return from(this.account.create<UserPreferences>(
            ID.unique(),
            email, password, names
        ))
    }
}