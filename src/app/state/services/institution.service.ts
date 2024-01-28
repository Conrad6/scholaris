import { Injectable, inject } from "@angular/core";
import { Client, Databases, Query } from "appwrite";
import { from } from "rxjs";
import { environment } from "../../../environments/environment.development";
import { Institution } from "../../../models";

const institutionCollectionId = '659074c14a88d2072f38';

@Injectable({ providedIn: 'root' })
export class InstitutionService {
    private readonly db = new Databases(inject(Client));

    getInstitutions(page: number, size: number) {
        return from(this.db.listDocuments<Institution>(environment.mainDbId, institutionCollectionId, [
            Query.offset(page * size)
        ]))
    }
}