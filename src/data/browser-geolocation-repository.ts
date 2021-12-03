import { Coordinate } from "src/domain/entities/coordinate";
import { UnavailableServiceError } from "src/domain/errors/unavailable-service.error";
import { GeolocationRepository } from "src/domain/services/protocols/geolocation-repository";

export class BrowserGeolocationRepository extends GeolocationRepository{
    constructor() { super(); }
    async getInstantPosition(): Promise<Coordinate> {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                position => {
                    resolve({ 
                        latitude: position.coords.latitude, 
                        longitude: position.coords.longitude });
                },
                error => { reject(UnavailableServiceError); });
        });
    }
}