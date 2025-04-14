import { Component } from "@angular/core";
import { homeConfig } from "./home.config";  
import { RouterModule } from '@angular/router';
import { CommonModule } from "@angular/common";

@Component({
    selector: 'app-home',
    imports: [RouterModule, CommonModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})

export class HomeComponent {
    config = homeConfig;
}