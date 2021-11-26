import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Coordinate } from "src/domain/entities/coordinate";
import { UnavailableServiceError } from "src/domain/errors/unavailable-service.error";
import { GeolocationRepository } from "src/domain/services/protocols/geolocation-repository";

export class IonicGeolocationRepository extends GeolocationRepository{
    constructor(private readonly geolocation: Geolocation) { super(); }
    async getInstantPosition(): Promise<Coordinate> {
        try {
            const position = await this.geolocation.getCurrentPosition();
            return { 
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }; 
        } catch { throw UnavailableServiceError; }
    }
}