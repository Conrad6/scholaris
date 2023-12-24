import { Injectable, inject } from "@angular/core";
import { toSignal } from '@angular/core/rxjs-interop';
import { Auth, user } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class UserService {
    private readonly fireAuth = inject(Auth);
    user = toSignal(user(this.fireAuth));
}