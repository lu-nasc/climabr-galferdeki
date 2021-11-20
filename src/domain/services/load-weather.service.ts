import { Geolocation } from '@ionic-native/geolocation';
import { City } from '../entities/city';
import { Coordinate } from '../entities/coordinate';
import { Weather } from '../entities/weather';
import { CityNotFoundError } from '../errors/city-not-found.error';
import { UnavailableServiceError } from '../errors/unavailable-service.error';
import { CityRepository } from './protocols/city-repository';
import { GeolocationRepository } from './protocols/geolocation-repository';
import { WeatherRepository } from './protocols/weather-repository';

export class LoadWeatherService {
  constructor(
    private readonly cityRepo: CityRepository,
    private readonly weatherRepo: WeatherRepository,
    private readonly geolocationRepo: GeolocationRepository
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
      const coordinate = await this.geolocationRepo.getInstantPosition();
      const nearestCityInRepo = (await this.cityRepo.getAll())
          .map((city) => { 
            return { 
              distance: this.distance(city.coord, coordinate), 
              city: city
            };
          })
          .reduce((previous, current) => {
            return previous.distance < current.distance ? previous : current;
          });
          const weather = await this.weatherRepo.load(nearestCityInRepo.city.coord);
          weather.city = nearestCityInRepo.city;
          
          return weather;
    } catch { throw UnavailableServiceError; }
    return null;
  }

  private distance(one: Coordinate, other: Coordinate): number {
    return Math.sqrt(Math.pow((one.latitude - other.latitude), 2.0) +
                     Math.pow((one.longitude - other.longitude), 2.0));
  }
}
