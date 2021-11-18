import { City } from '../entities/city';
import { Coordinate } from '../entities/coordinate';
import { Weather } from '../entities/weather';
import { CityNotFoundError } from '../errors/city-not-found.error';
import { UnavailableServiceError } from '../errors/unavailable-service.error';
import { CityRepository } from './protocols/city-repository';
import { WeatherRepository } from './protocols/weather-repository';
import { Geolocation } from '@ionic-native/geolocation/ngx';

export class LoadWeatherService {
  constructor(
    private readonly cityRepo: CityRepository,
    private readonly weatherRepo: WeatherRepository,
  ) {}

  async loadByCity(cityId: number): Promise<Weather> {
    const city: City = await this.cityRepo.getById(cityId);

    if (!city) {
      throw new CityNotFoundError();
    }

    const weather = await this.weatherRepo.load(city.coord);
    weather.city = city;

    return weather;
  }

  async loadByGeolocation(): Promise<Weather> {
    try {
      const geoposition = await this.geolocation.getCurrentPosition();
      
      const coordinate: Coordinate = { 
        latitude: geoposition.coords.latitude, 
        longitude: geoposition.coords.longitude
      }
      
      const weather = await this.weatherRepo.load(coordinate);
      return weather;
    } catch { throw new CityNotFoundError(); }
  }
}
