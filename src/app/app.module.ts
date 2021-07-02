import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { AceModule } from 'ngx-ace-wrapper';
import { ACE_CONFIG } from 'ngx-ace-wrapper';
import { AceConfigInterface } from 'ngx-ace-wrapper';
import { SidebarComponent } from './main/sidebar/sidebar.component';
import { TemplateComponent } from './main/template/template.component';
import { DataComponent } from './main/data/data.component';
import { PreviewComponent } from './main/preview/preview.component';

const DEFAULT_ACE_CONFIG: AceConfigInterface = {
};
const ROUTES = [
  {
    path: 'main',
    component: MainComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/main'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    SidebarComponent,
    TemplateComponent,
    DataComponent,
    PreviewComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(ROUTES),
    AceModule
  ],
  providers: [
    {
      provide: ACE_CONFIG,
      useValue: DEFAULT_ACE_CONFIG
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
