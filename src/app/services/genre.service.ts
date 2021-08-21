import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Genre } from '../commons/genre';

@Injectable({
  providedIn: 'root'
})
export class GenreService {

  constructor(private httpClient: HttpClient) { }

  getGenreList(): Observable<GetResponseGenres>{
    let url = environment.tmdb.baseUrl + '/genre/movie/list';
    return this.httpClient.get<GetResponseGenres>(url);
  }
}

interface GetResponseGenres{
  genres: Genre[];
}
