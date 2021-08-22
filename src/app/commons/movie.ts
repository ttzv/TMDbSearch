import { Genre } from "./genre";

export class Movie {
    id: number;
    adult: boolean;
    backdrop_path: string;
    genres: Genre[];
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    posterFullPath: string | null = null;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    runtime: number;

}
