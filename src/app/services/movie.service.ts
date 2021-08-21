import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Movie } from '../commons/movie';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private httpClient: HttpClient) { }

  getPopularPaginated(pageNo: number): Observable<GetResponseMovies>{
    let url = environment.tmdb.baseUrl + '/movie/popular';
    if(pageNo > 0) url += `?page=${pageNo}`;
    return this.httpClient.get<GetResponseMovies>(url);
  }

  searchPaginated(params: {query: string | null, pageNo: number, year: string | null}): Observable<GetResponseMovies>{
    let url = environment.tmdb.baseUrl + `/search/movie?query=${params.query}`;
    if(params.year) url += `&primary_release_year=${params.year}`;
    if(params.pageNo > 0) url += `&page=${params.pageNo}`;
    return this.httpClient.get<GetResponseMovies>(url);
  }

  discoverPaginated(query: string, pageNo: number): Observable<GetResponseMovies>{
    let url = environment.tmdb.baseUrl + `/discover/movie?${query}`;
    if(pageNo > 0) url += `&page=${pageNo}`;
    return this.httpClient.get<GetResponseMovies>(url);
  }


}



interface GetResponseMovies{
  page: number,
  results: Movie[],
  total_pages: number,
  total_results: number
}