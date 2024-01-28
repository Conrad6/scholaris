export class SignIn {
    static readonly type = '[User] Sign in';
    constructor(readonly email: string, readonly password: string) { }
}

export class SignUp {
    static readonly type = '[User] Sign up';
    constructor(readonly names: string, readonly email: string, readonly password: string){}
}

export class SignOut {
    static readonly type = '[User] Sign out';
}