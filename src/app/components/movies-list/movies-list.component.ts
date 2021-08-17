import { Component, OnInit } from '@angular/core';
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
  movieList: Movie[];
  page: number = 0;

  constructor(private configurationService: ConfigurationService,
              private movieService: MovieService,
              private imageService: ImageService) { }

  ngOnInit(): void {
    this.listMovies();
  }

  listMovies() {
    this.movieService.getPopularPaginated(0).subscribe(
      data => {
        this.movieList = data.results;
        this.movieList.forEach(movieEl => {
          movieEl.posterFullPath = 
            this.imageService.posterUrl('default', movieEl.poster_path);
        });
      });
    }
}
