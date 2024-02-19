import { Injectable } from "@angular/core";
import { Observable, from, switchMap, throwError } from "rxjs";

@Injectable({ providedIn: 'root' })
export class UtilService {
    getGeolocationIfPossible() {
        return from(navigator.permissions.query({ name: 'geolocation' })).pipe(
            switchMap(result => {
                if (result.state == 'denied') {
                    return throwError(() => new Error('Location services unavailable'))
                }
                return new Observable<{ lat: number, lon: number }>(subscriber => {
                    navigator.geolocation.getCurrentPosition(({ coords: { latitude: lat, longitude: lon } }) => {
                        subscriber.next({ lat, lon });
                        subscriber.complete();
                    }, err => {
                        subscriber.error(new Error(`Location services unavailable - ${err.message}`));
                    }, { enableHighAccuracy: false });
                })
            })
        )
    }
}