import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { City } from 'src/domain/entities/city';
import { Coordinate } from 'src/domain/entities/coordinate';
import { GetGeolocationService } from 'src/domain/services/get-geolocation.service';
import { SearchCityService } from 'src/domain/services/search-city.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  cities: City[];
  hasError: boolean = false;
  errorMessage: string;

  constructor(
    private readonly searchService: SearchCityService,
    private readonly geolocationService: GetGeolocationService,
    private readonly router: Router
  ) {}

  async onSearch(query: string) {
    try {
      this.hasError = false;
      this.cities = await this.searchService.search(query);
    } catch (error) {
      this.hasError = true;
      this.errorMessage = error.message;
    }
  }

  onSelectCity(cityId: string) {
    this.router.navigateByUrl(`/weather/${cityId}`);
  }

  onSelectCurrentLocation(coordinate: Coordinate) {
    this.router.navigate(['/weather'], {
      queryParams: {
        latitude:coordinate.latitude, 
        longitude: coordinate.longitude }
      });
  }

}
