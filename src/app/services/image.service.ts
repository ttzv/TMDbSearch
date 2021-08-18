import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ConfigurationService } from './configuration.service';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private configurationService: ConfigurationService) { }

  posterUrl(size: string, posterPath: string): string{
    if (size === 'default') size = '/w185';
    if (!posterPath) return environment.tmdb.posterPlaceholder;
    return this.configurationService.secureBaseUrl + size + posterPath;
  }

  

}
