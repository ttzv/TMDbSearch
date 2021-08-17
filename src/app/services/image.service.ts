import { Injectable } from '@angular/core';
import { ConfigurationService } from './configuration.service';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private configurationService: ConfigurationService) { }

  posterUrl(size: string, posterPath: string): string{
    if (size === 'default') size = '/w185';
    return this.configurationService.secureBaseUrl + size + posterPath;
  }

  

}
