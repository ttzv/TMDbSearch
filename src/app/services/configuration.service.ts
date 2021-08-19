import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Configuration } from '../commons/configuration';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  config: BehaviorSubject<Configuration | null> = 
      new BehaviorSubject<Configuration | null>(this.getFromStorage());
  private cfgUrl: string = environment.tmdb.baseUrl + '/configuration';
  private storage = localStorage;

  constructor(private httpClient: HttpClient) {

  }

  getConfiguration(){
    const configuration = this.getFromStorage();
    if(!configuration){
      this.httpClient.get<Configuration>(this.cfgUrl).subscribe(
        data => this.config.next(data)
        );
    } else {
      this.config.next(configuration);
    }
  }

  getFromStorage(): Configuration | null{
    const persisted = localStorage.getItem('configuration');
    const age = localStorage.getItem('configurationAge');
    if(persisted){
      return JSON.parse(persisted);
    }
    return null;
  }

  persistInStorage(config: Configuration){
    this.storage.setItem('configuration', JSON.stringify(config));
    this.storage.setItem('configurationAge', JSON.stringify(new Date().getTime()));
  }

  

}

