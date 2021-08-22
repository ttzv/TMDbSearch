import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Movie } from 'src/app/commons/movie';
import { GenreService } from 'src/app/services/genre.service';
import { ImageService } from 'src/app/services/image.service';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {

  movie: Movie = new Movie();
  loading: boolean = false;
  scoreBig: string = '0';
  scoreSmall: string = '0';
  releaseYear: string = '';
  genres: string = '';

  constructor(private route: ActivatedRoute,
              private movieService: MovieService,
              private imageService: ImageService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.loading = true;
      this.loadMovie();
    })
  }

  loadMovie() {
    const movieId = +this.route.snapshot.paramMap.get('id')!;
    this.movieService.getMovieById(movieId).subscribe(
      data => {
        this.movie = data;
        this.loading = false;
        this.processMovieDetails();
    });
  }

  processMovieDetails() {
    [this.scoreBig, this.scoreSmall] = this.movie.vote_average.toString().split('.');
    this.releaseYear = this.movie.release_date.split('-')[0];
    this.movie.posterFullPath = this.imageService.getPosterPlaceholder();
        this.imageService.baseSecureUrl.subscribe(
          url => this.movie.posterFullPath =
              this.imageService.getPosterUrl(url, 'default', this.movie.poster_path)
        )
    this.genres = this.movie.genres.map(g => g.name).join(', ');
  }

}
