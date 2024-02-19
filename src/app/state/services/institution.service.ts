import { Injectable, inject } from "@angular/core";
import { Client, Databases, ID, Query } from "appwrite";
import { from, map } from "rxjs";
import { environment } from "../../../environments/environment.development";
import { Institution } from "../../../models";

const institutionCollectionId = '659074c14a88d2072f38';

@Injectable({ providedIn: 'root' })
export class InstitutionService {
    private readonly db = new Databases(inject(Client));

    get nextSlugId() {
        return ('' + Date.now()).substring(-7);
    }

    createInstitution(
        name: string,
        country: string,
        contacts: { emails?: string[], phoneNumbers?: string[] },
        location: { lat?: number, lon?: number, line1?: string, line2?: string, city?: string, country?: string }
    ) {
        const slug = `${name.toLowerCase().replaceAll(/[\s]/, '-').substring(0, 5)}-${this.nextSlugId}`;
        return from(this.db.createDocument(environment.mainDbId, institutionCollectionId, ID.unique(), {
            
        }))
    }

    getInstitutions(page: number, size: number) {
        return from(this.db.listDocuments<Institution>(environment.mainDbId, institutionCollectionId, [
            Query.offset(page * size)
        ]))
    }

    checkIfInstitutionNameIsAvailable(name: string) {
        return from(this.db.listDocuments(environment.mainDbId, institutionCollectionId, [
            Query.search('name', name)
        ])).pipe(
            map(list => list.total == 0)
        );
    }
}