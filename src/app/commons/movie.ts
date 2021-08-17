export class Movie {
    id: number;
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    posterFullPath: string | null = null;
    release_date: string;
    title: string;
    video: boolean;
}
