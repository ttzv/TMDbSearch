import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Configuration } from '../commons/configuration';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  storage: Storage = sessionStorage;
  baseUrl: string
  secureBaseUrl: string;
  backdropSizes: string[];
  logoSizes: string[];
  posterSizes: string[];
  profileSizes: string[];
  stillSizes: string[];

  private cfgUrl: string = environment.tmdb.baseUrl + '/configuration';

  constructor(private httpClient: HttpClient) {
    this.getConfiguration().subscribe( data => {
      const cfgImages = data.images;
      this.baseUrl = cfgImages.base_url;
      this.secureBaseUrl = cfgImages.secure_base_url;
      this.backdropSizes = cfgImages.backdrop_sizes;
      this.logoSizes = cfgImages.logo_sizes;
      this.posterSizes = cfgImages.poster_sizes;
      this.profileSizes = cfgImages.profile_sizes;
      this.stillSizes = cfgImages.still_sizes;
    })
  }

  getConfiguration(): Observable<Configuration>{
    return this.httpClient.get<Configuration>(this.cfgUrl);
  }

  

}

