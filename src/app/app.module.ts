import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthTokenInterceptorService } from './interceptors/auth-token-interceptor.service';
import { MoviesListComponent } from './components/movies-list/movies-list.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { ConfigurationService } from './services/configuration.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {path: 'search/:query/:year', component: MoviesListComponent},
  {path: 'search/:query', component: MoviesListComponent},
  {path: 'discover', component: MoviesListComponent},
  {path: 'popular', component: MoviesListComponent},
  {path: '', redirectTo: '/popular', pathMatch: 'full'},
  {path: '**', redirectTo: '/popular', pathMatch: 'full'}
]

@NgModule({
  declarations: [
    AppComponent,
    MoviesListComponent,
    SearchComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptorService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
