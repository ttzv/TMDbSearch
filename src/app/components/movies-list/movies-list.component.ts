import { query } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Configuration } from 'src/app/commons/configuration';
import { Movie } from 'src/app/commons/movie';
import { ImageService } from 'src/app/services/image.service';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-movies-list',
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.css']
})
export class MoviesListComponent implements OnInit {

  configuration: Configuration;
  movieList: Movie[] = [];
  loading: boolean = true;

  private page: number = 1;
  private totalPages = 1;

  constructor(private movieService: MovieService,
              private imageService: ImageService,
              private route: ActivatedRoute,
              private router:Router) { }

  ngOnInit(): void {
    this.route.url.subscribe(() => {
      this.handleRouteChange();
    });
  }

  handleRouteChange(){
    this.page = 1;
    this.movieList = [];
    this.listMovies();
  }

  listMovies() {
    this.loading = true;
    const searchMode = this.route.snapshot.paramMap.has('query');
    const discoverMode = this.route.snapshot.queryParamMap.keys.length > 0;
    if(searchMode){
      this.searchMovies()
    } else if (discoverMode) {
      this.discoverMovies();
    } else {
      this.listPopular();
    }
  }

  discoverMovies() {
    const query = this.router.url.split('?')[1];
    this.movieService.discoverPaginated(query, this.page).subscribe(
      this.handlePaginatedData());
  }

  searchMovies() {
    const query = this.route.snapshot.paramMap.get('query');
    const year = this.route.snapshot.paramMap.get('year');
    this.movieService.searchPaginated(
            {
              query: query,
              pageNo: this.page,
              year: year
            }
              ).subscribe(
      this.handlePaginatedData());
  }

  listPopular() {
    this.movieService.getPopularPaginated(this.page).subscribe(
      this.handlePaginatedData());
  }

  handlePaginatedData(){
    return (data: { results: Movie[]; total_pages: number }) => {
      const newMovies = data.results;
      this.totalPages = data.total_pages;
      newMovies.forEach((movieEl: Movie) => {
        movieEl.posterFullPath = this.imageService.getPosterPlaceholder();
        this.imageService.baseSecureUrl.subscribe(
          url => movieEl.posterFullPath =
              this.imageService.getPosterUrl(url, 'default', movieEl.poster_path)
        )});
      this.movieList.push(...newMovies);
      this.page += 1;
      this.loading = false;
    }
  }

  handleScroll(event: any){
    const scrollPosition = this.getScrollPositionFloat(event.target);
    if(this.canLoadMore(scrollPosition)){
      this.listMovies();
    }
  }

  getScrollPositionFloat(scrollContainer: any): number {
    const scrollPositionTop = scrollContainer.scrollTop;
    const scrollMaxHeight = scrollContainer.scrollHeight - scrollContainer.offsetHeight;
    return scrollPositionTop / scrollMaxHeight;
  }

  canLoadMore(scrollPosition: number){
    if(this.page >= this.totalPages) return false;
    return (scrollPosition >= 0.95 && !this.loading) ? 
      true : false;
  }
}
