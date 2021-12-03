import { City } from '../entities/city';
import { Coordinate } from '../entities/coordinate';
import { Weather } from '../entities/weather';
import { CityNotFoundError } from '../errors/city-not-found.error';
import { UnavailableServiceError } from '../errors/unavailable-service.error';
import { CityRepository } from './protocols/city-repository';
import { WeatherRepository } from './protocols/weather-repository';

export class LoadWeatherService {
  constructor(
    private readonly cityRepo: CityRepository,
    private readonly weatherRepo: WeatherRepository
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

  async loadByCoordinate(coordinate: Coordinate): Promise<Weather> {
    try {
      const nearestCityInRepo = (await this.cityRepo.getAll())
          .map((city) => {
            console.log(this.distance(coordinate, city.coord)); 
            return { 
              distance: this.distance(coordinate, city.coord), 
              city: city };
          })
          .reduce((previous, current) => {
            return previous.distance < current.distance ? previous : current;
          });
          const weather = await this.weatherRepo.load(nearestCityInRepo.city.coord);
          weather.city = nearestCityInRepo.city;
          
          return weather;
    } catch { throw UnavailableServiceError; }
  }

  private toRadiansa(num: number): number {
    return num * Math.PI / 180;
  }

  private distance(one: Coordinate, other: Coordinate): number {
    const earthRadius = 6371; // In kilometers
    const deltaLatitude = this.toRadiansa(other.latitude - one.latitude);
    const deltaLongitude = this.toRadiansa(other.longitude - one.longitude);
    const halfCalculation = Math.sin(deltaLatitude / 2) ** 2 + 
                            Math.sin(deltaLongitude / 2) ** 2 *
                            Math.cos(this.toRadiansa(one.latitude)) *
                            Math.cos(this.toRadiansa(other.latitude));
    return earthRadius * 2 * 
        Math.asin(Math.sqrt(halfCalculation));
  }
}
