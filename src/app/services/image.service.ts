import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ConfigurationService } from './configuration.service';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  baseSecureUrl: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>('');
  constructor(private configurationService: ConfigurationService) {
    configurationService.getConfiguration();
    configurationService.config.subscribe(
      data => this.baseSecureUrl.next(data?.images.secure_base_url)
    )
   }

  getPosterUrl(baseUrl: string | undefined, size: string, posterPath: string): string{
    if (size === 'default') size = '/w185';
    if (!posterPath || !baseUrl) return this.getPosterPlaceholder();
    return baseUrl + size + posterPath;
  }

  getPosterPlaceholder(): string {
    return environment.tmdb.posterPlaceholder;
  }
}
