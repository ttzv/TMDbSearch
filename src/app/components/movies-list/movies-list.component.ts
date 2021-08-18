import { Component, HostListener, OnInit } from '@angular/core';
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

  private page: number = 0;
  private refreshed: boolean = false;

  constructor(private configurationService: ConfigurationService,
              private movieService: MovieService,
              private imageService: ImageService) { }

  ngOnInit(): void {
    this.listMovies();
    document.addEventListener('scroll', console.log);
  }

  listMovies() {
    this.movieService.getPopularPaginated(0).subscribe(
      data => {
        const newMovies = data.results;
        newMovies.forEach(movieEl => {
          movieEl.posterFullPath = 
            this.imageService.posterUrl('default', movieEl.poster_path);
        });
        this.movieList.push(...newMovies);
      });
    }

  handleScroll(event: any){
    const scrollPosition = this.getScrollPositionFloat(event.target);
    if(this.loadMore(scrollPosition)){
      this.page += 1;
      this.listMovies();
    }
  }

  getScrollPositionFloat(scrollContainer: any): number {
    const scrollPositionTop = scrollContainer.scrollTop;
    const scrollMaxHeight = scrollContainer.scrollHeight - scrollContainer.offsetHeight;
    return scrollPositionTop / scrollMaxHeight;
  }

  loadMore(scrollPosition: number){
    if(scrollPosition > 0.75 && !this.refreshed){
      this.refreshed = true;
      return true;
    } else if (scrollPosition < 0.75){
      this.refreshed = false;
      return false;
    }
    return false;
  }
}
