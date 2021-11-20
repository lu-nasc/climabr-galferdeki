import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Coordinate } from '../entities/coordinate';
import { UnavailableServiceError } from '../errors/unavailable-service.error';
import { GeolocationRepository } from './protocols/geolocation-repository';

export class GetGeolocationService {
    constructor(private readonly geoRepo: GeolocationRepository) { }

    async getInstantPosition(): Promise<Coordinate> {
        return this.geoRepo.getInstantPosition(); 
    }
}