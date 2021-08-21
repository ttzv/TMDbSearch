import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Genre } from 'src/app/commons/genre';
import { GenreService } from 'src/app/services/genre.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  private filterFormVisible: boolean;
  
  filterForm: FormGroup;
  genreList: Genre[];
  selectedGenres: Genre[] = [];
  yearOptions: number[] = [];
  ratingOptions: number[] = [1,2,3,4,5,6,7,8,9,10];
  search: string;
  filterCount: number = 0;

  storage: Storage = sessionStorage;
  genresFromStorage: Genre[] = [];
  
  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private genreService: GenreService) { }



  ngOnInit(): void {
    this.filterForm = this.formBuilder.group({
      date: this.formBuilder.group({
        at: null,
        after: null,
        before: null
      }),
      genres: this.formBuilder.group({
        genre: null
      }),
      rating: this.formBuilder.group({
        rating: null
      }),
      sorting: this.formBuilder.group({
        sort: null
      }),
    })

    this.genreService.getGenreList().subscribe(
      data => {
        this.genreList = data.genres;
        this.genresFromStorage.forEach((genre: Genre) => this.handleGenreSelection(genre));
      });
      
      this.readFromStorage();
    this.populateYearSelect();

  }

  readFromStorage() {
    const parsed = JSON.parse(this.storage.getItem('tmdbStore')!)
    if(parsed){  
      this.filterCount = parsed.filterCount;
      this.filterForm.setValue(parsed.filterForm);
      this.search = parsed.search;
      this.genresFromStorage = parsed.selectedGenres;
    }
  }



  get dateAt(){ return this.filterForm.get('date.at'); }
  get dateAfter(){ return this.filterForm.get('date.after'); }
  get dateBefore(){ return this.filterForm.get('date.before'); }
  get selectGenre(){ return this.filterForm.get('genres.genre'); }  


  populateYearSelect(){
    const currentYear = new Date().getFullYear();
    for (let index = currentYear; index >= currentYear-100; index--) {
      this.yearOptions.push(index);   
    }
  }

  performSearch(text: string){
    const filterQuery = this.getFilterQuery();
    console.log(text);
    if(text){
      const year = this.dateAt?.value;
      if(year){
        this.router.navigateByUrl(`search/${text}/${year}`);
      } else {
        this.router.navigateByUrl(`search/${text}`);
      }
    } else if(this.filterCount > 0){
      this.router.navigateByUrl(`/discover${filterQuery}`);
    } else {
      this.router.navigateByUrl(``);
    }

    this.persistInSession(this.search, this.filterCount, this.filterForm, this.selectedGenres)
  }

  toggleFilters(){
    this.filterFormVisible = !this.filterFormVisible;
  }

  filterFormClasses(): { [key: string]: boolean} {
    const classes = {'filter-form': true,
                    'visible': true};
    classes['visible'] = this.filterFormVisible;
    return classes;
  }

  private getFilterQuery(): string{
    const filters = this.sanitize(this.filterForm.value)
    this.filterCount = this.countFilters(filters);

    return this.buildSearchPath(filters);
  }

  private buildSearchPath(filters: any) {
    let filterPath: string[] = [];
    if(filters.date){
      if(filters.date.at) filterPath.push(`primary_release_year=${filters.date.at}`);
      if(filters.date.after) filterPath.push(`primary_release_date.gte=${filters.date.after}`);
      if(filters.date.before) filterPath.push(`primary_release_date.lte=${filters.date.before}`);
    }
    if(this.selectedGenres.length > 0)
      filterPath.push(`with_genres=${this.selectedGenres.map(g => g.id).join(',')}`);
    if(filters.rating) filterPath.push(`vote_average.gte=${filters.rating.rating}`);
    if(filters.sorting) filterPath.push(`sort_by=${filters.sorting.sort}`);
    return `?${filterPath.join('&')}`;
  }

  sanitize(obj:any): any{
    const sanitized = JSON.parse(JSON.stringify(obj, (key, value) => {
      return (value === null ? undefined : value);
    }));
    Object.keys(sanitized).forEach(k => {
      if(Object.keys(sanitized[k]).length === 0) delete sanitized[k];
    })
    return sanitized; 
  }

  handleGenreSelection(genre: Genre){
    let foundGenre: Genre | undefined = undefined;
    if(genre){
      foundGenre = this.genreList.find(g => g.id === genre.id);
    }
    if(foundGenre){
      this.selectedGenres.push(genre);
      let index = this.genreList.indexOf(genre);
      if(!index) index = this.genreList.indexOf(foundGenre);
      this.genreList.splice(this.genreList.indexOf(genre), 1);
    }
    this.search = '';
  }

  handleGenreDeselection(genre: Genre){
    console.log(genre);
    if(this.selectedGenres.includes(genre)){
      this.genreList.push(genre);
      this.selectedGenres.splice(this.selectedGenres.indexOf(genre), 1);
    }
    this.selectGenre?.reset();
    this.sortGenreList();
    this.search = '';
  }

  sortGenreList(){
    this.genreList.sort((g1, g2) =>{
      if (g1.name === g2.name) return 0;
      if (g1.name < g2.name) return -1;
      return 1;
    } );
  }

  onReset(){
    this.filterForm.reset();
    if(this.selectedGenres.length > 0){
      this.genreList.push(...this.selectedGenres);
      this.selectedGenres = [];
      this.sortGenreList();
    }
    this.clearSearch();
    
  }

  resetDateRange(){
    this.dateAfter?.reset()
    this.dateBefore?.reset();
  }

  resetDateAt(){
    this.dateAt?.reset();
    this.search = '';
  }

  countFilters(sanitizedFilters: {key: string} ): number {
    let filterCount = this.selectedGenres.length;
    const keys = Object.keys(sanitizedFilters);
    filterCount += keys.length;
    if(keys.includes('genres')) filterCount -= 1;
    return filterCount;
  }

  getDate(): string{
    return new Date().toISOString().split('T')[0];
  }

  clearSearch(){
    this.search = '';
  }

  persistInSession(search: string, filterCount: number, filterForm: FormGroup, selectedGenres: Genre[]) {
    const tmdbStore = {
      search: search,
      filterCount: filterCount,
      filterForm: filterForm.value,
      selectedGenres: selectedGenres
    }
    this.storage.setItem('tmdbStore', JSON.stringify(tmdbStore));
  }
}




