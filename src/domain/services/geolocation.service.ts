import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Coordinate } from '../entities/coordinate';
import { UnavailableServiceError } from '../errors/unavailable-service.error';
import { GeolocationRepository } from './protocols/geolocation-repository';

export class GeolocationService extends GeolocationRepository {
    constructor(private readonly geolocation: Geolocation) { super() }

    async getInstantPosition(): Promise<Coordinate> {
        let coordinate: Coordinate;
        this.geolocation.getCurrentPosition((position) => {
            coordinate.latitude = position.coords.latitude;
            coordinate.longitude = position.coords.longitude;
        }, () => { throw UnavailableServiceError; })
        return coordinate;
    }
}