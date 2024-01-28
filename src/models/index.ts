import { Models } from "appwrite";

export type AuthRequest = {
    email: string;
    password: string;
}

export type NewUserRequest = {
    names: string;
    email: string;
    password: string;
}

export type UserPreferences = Models.Preferences & {
    theme: 'light' | 'dark',
    logo?: string;
}

export type UserStateModel = {
    principal?: Models.User<UserPreferences>,
    session?: Models.Session,
    logo?: string
}

export type Institution = Models.Document & {
    name: string;
}