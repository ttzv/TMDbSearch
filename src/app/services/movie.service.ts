import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Movie } from '../commons/movie';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private httpClient: HttpClient) { }

  // getMovie(id: number): Observable<Movie>{

  // }

  getPopularPaginated(pageNo: number): Observable<GetResponseMovies>{
    let url = environment.tmdb.baseUrl + '/movie/popular';
    if(pageNo > 0) url += `?page=${pageNo}`;
    return this.httpClient.get<GetResponseMovies>(url);
  }
}

interface GetResponseMovies{
  page: number,
  results: Movie[],
  total_pages: number,
  total_results: number
}