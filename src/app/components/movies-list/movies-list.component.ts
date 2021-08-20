import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Configuration } from 'src/app/commons/configuration';
import { Movie } from 'src/app/commons/movie';
import { ConfigurationService } from 'src/app/services/configuration.service';
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

  constructor(private movieService: MovieService,
              private imageService: ImageService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.page = 1;
      this.movieList = [];
      this.listMovies();
    })
  }

  listMovies() {
    this.loading = true;
    const searchMode = this.route.snapshot.paramMap.has('query');
    console.log(this.route.snapshot.paramMap)
    if(searchMode){
      console.log(searchMode);
      this.searchMovies()
    } else {
      this.listPopular();
    }
  }

  searchMovies() {
    const query = this.route.snapshot.paramMap.get('query');
    this.movieService.searchPaginated(query!, this.page).subscribe(
      this.handlePaginatedData());
  }

  listPopular() {
    this.movieService.getPopularPaginated(this.page).subscribe(
      this.handlePaginatedData());
  }

  handlePaginatedData(){
    return (data: { results: any; }) => {
      const newMovies = data.results;
      newMovies.forEach((movieEl: { posterFullPath: string; poster_path: string; }) => {
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
    return (scrollPosition >= 0.95 && !this.loading) ? 
      true : false;
  }
}
