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
    description?: string;
    logo?: string;
    visible: boolean;
    isLive: boolean;
    lat?: number;
    lon?: number;
    location_mode: 'manual' | 'auto',
    line1?: string;
    line2?: string;
    city?: string;
    country?: string;
    slug: string;
    emails?: string[];
    phoneNumbers?: string[];
}