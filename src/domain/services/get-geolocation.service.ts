import { Coordinate } from '../entities/coordinate';
import { GeolocationRepository } from './protocols/geolocation-repository';

export class GetGeolocationService {
    constructor(private readonly geoRepo: GeolocationRepository) { }

    async getInstantPosition(): Promise<Coordinate> {
        return this.geoRepo.getInstantPosition(); 
    }
}