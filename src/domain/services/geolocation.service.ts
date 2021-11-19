import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Coordinate } from '../entities/coordinate';
import { UnavailableServiceError } from '../errors/unavailable-service.error';
import { GeolocationRepository } from './protocols/geolocation-repository';

export class GeolocationService extends GeolocationRepository {
    constructor() { super() }

    async getInstantPosition(): Promise<Coordinate> {
        try {
            const position = await Geolocation.getCurrentPosition();
            return { 
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }
        } catch { throw UnavailableServiceError; }
    }
}