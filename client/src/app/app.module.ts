import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CardComponent } from './components/card/card.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import axios from 'axios';
import { env } from 'src/environments/environment';
import { TableComponent } from './components/table/table.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { PlayerComponent } from './components/player/player.component';

@NgModule({
  declarations: [AppComponent, CardComponent, TableComponent, PlayerComponent],
  imports: [
    BrowserModule,
    NgbModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
    }),
  ],
  providers: [
    {
      provide: axios.Axios,
      useFactory: () => axios.create({ baseURL: env.apiUrl }),
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
