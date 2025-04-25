import { Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { AboutComponent } from '../about/about.component';
import { ColorCoordinateGenerationComponent } from '../color/color_coordinate_generation.component';
import { ColorManagementComponent } from '../manage_colors/manage_colors.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'color', component: ColorCoordinateGenerationComponent },
    { path: 'manage_colors', component: ColorManagementComponent }
  ];
