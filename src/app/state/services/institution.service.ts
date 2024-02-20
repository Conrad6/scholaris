import { Injectable, inject } from "@angular/core";
import { Client, Databases, ID, Permission, Query, Role, Teams } from "appwrite";
import { from, map, switchMap } from "rxjs";
import { environment } from "../../../environments/environment.development";
import { Institution } from "../../../models";

const institutionCollectionId = '659074c14a88d2072f38';

@Injectable({ providedIn: 'root' })
export class InstitutionService {
    private readonly db = new Databases(inject(Client));
    private readonly teams = new Teams(inject(Client));

    get nextSlugId() {
        return ('' + Date.now()).substring(6);
    }
    
    createInstitution(
        name: string,
        contacts: { emails?: string[], phoneNumbers?: string[] },
        location: { useCurrentLocation: boolean, lat?: number, lon?: number, line1?: string, line2?: string, city?: string, country?: string }
    ) {
        return from(this.teams.create(ID.unique(), name)).pipe(
            switchMap(team => {
                const slug = `${name.toLowerCase().replaceAll(/[\s]/g, '-').substring(0, 5)}-${this.nextSlugId}`;
                return from(this.db.createDocument(environment.mainDbId, institutionCollectionId, team.$id, {
                    name,
                    lat: location.lat ?? null,
                    lon: location.lon ?? null,
                    line1: location.line1 ?? null,
                    line2: location.line2 ?? null,
                    city: location.city ?? null,
                    country: location.country ?? null,
                    location_mode: location.useCurrentLocation !== false ? 'auto' : 'manual',
                    slug,
                    emails: contacts.emails ?? [],
                    phoneNumbers: contacts.phoneNumbers ?? [],
                }, [
                    Permission.read(Role.any()),
                    Permission.update(Role.team(team.$id, 'owner')),
                    Permission.delete(Role.team(team.$id, 'owner'))
                ])).pipe(
                    map(institution => {
                        return institution as Institution;
                    })
                );
            })
        )
    }

    getInstitutions(page: number, size: number) {
        return from(this.db.listDocuments<Institution>(environment.mainDbId, institutionCollectionId, [
            Query.offset(page * size)
        ]))
    }

    checkIfInstitutionNameIsAvailable(name: string) {
        return from(this.db.listDocuments(environment.mainDbId, institutionCollectionId, [
            Query.equal('name', name)
        ])).pipe(
            map(list => list.total == 0)
        );
    }
}